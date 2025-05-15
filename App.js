import React, { useEffect, useState, useCallback, memo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import mqtt from 'mqtt';

// Componente para exibir um dado sensor com rótulo e valor
const SensorDisplay = memo(({ label, value, unit }) => (
  <View style={styles.sensorItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>
      {value !== null ? `${value} ${unit}` : '---'}
    </Text>
  </View>
));

// Componente para o botão de controle do LED
const ControlButton = memo(({ isOn, onPress }) => (
  <TouchableOpacity
    style={[styles.button, isOn ? styles.buttonOn : styles.buttonOff]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.buttonText}>
      {isOn ? 'Desligar LED' : 'Ligar LED'}
    </Text>
  </TouchableOpacity>
));

/**
 * Aplicativo principal para monitoramento IoT
 * 
 * Este aplicativo se conecta a um broker MQTT para:
 * 1. Receber dados de temperatura e umidade
 * 2. Controlar um LED remotamente
 */
export default function App() {
  // Estados para armazenar os dados dos sensores e atuadores
  const [sensorData, setSensorData] = useState({
    temperatura: null,
    umidade: null,
  });
  const [ledLigado, setLedLigado] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Conectando...');
  
  // Tópicos MQTT utilizados na aplicação
  const TOPICS = {
    SENSOR: 'fiap/iot/temphumi',
    LED: 'fiap/iot/led'
  };

  // Configuração e conexão ao broker MQTT
  useEffect(() => {
    // Configurações da conexão MQTT
    const mqttOptions = {
      keepalive: 60,
      clientId: `mqtt_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
    };
    
    // Conectar ao broker MQTT
    console.log('Iniciando conexão MQTT...');
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', mqttOptions);
    
    // Eventos de conexão
    client.on('connect', () => {
      console.log('Conectado ao broker MQTT!');
      setConnectionStatus('Conectado');
      
      // Inscrever nos tópicos desejados
      client.subscribe(TOPICS.SENSOR, { qos: 0 }, (err) => {
        if (err) console.error('Erro ao se inscrever:', err);
        else console.log(`Inscrito no tópico: ${TOPICS.SENSOR}`);
      });
    });

    // Processamento de mensagens recebidas
    client.on('message', (topic, message) => {
      try {
        // Converter a mensagem para objeto JSON
        const payload = JSON.parse(message.toString());
        console.log(`Mensagem recebida no tópico ${topic}:`, payload);
        
        // Atualizar os estados com base no tópico
        if (topic === TOPICS.SENSOR) {
          setSensorData(prevData => ({
            ...prevData,
            temperatura: payload.temperatura !== undefined ? payload.temperatura : prevData.temperatura,
            umidade: payload.umidade !== undefined ? payload.umidade : prevData.umidade,
          }));
          
          // Atualiza o estado do LED se a informação estiver presente
          if (payload.status_led !== undefined) {
            setLedLigado(payload.status_led === 'on');
          }
        }
      } catch (error) {
        console.warn('Erro ao processar mensagem:', error.message);
      }
    });

    // Eventos de erro e reconexão
    client.on('error', (err) => {
      console.error('Erro MQTT:', err);
      setConnectionStatus('Erro de conexão');
    });

    client.on('reconnect', () => {
      console.log('Tentando reconectar...');
      setConnectionStatus('Reconectando...');
    });

    client.on('offline', () => {
      console.log('Cliente MQTT offline');
      setConnectionStatus('Desconectado');
    });

    // Limpeza ao desmontar o componente
    return () => {
      console.log('Encerrando conexão MQTT...');
      client.end();
    };
  }, []);

  /**
   * Função para alternar o estado do LED
   * Envia comando para o tópico de controle do LED
   */
  const alternarLed = useCallback(() => {
    try {
      // Criar um cliente MQTT temporário (como estamos fora do useEffect)
      const tempClient = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
        clientId: `mqtt_temp_${Math.random().toString(16).slice(2, 10)}`,
      });
      
      tempClient.on('connect', () => {
        // Criar payload com o comando oposto ao estado atual
        const comando = {
          led: ledLigado ? 0 : 1,
        };
        
        // Publicar o comando no tópico do LED
        console.log(`Enviando comando: ${JSON.stringify(comando)}`);
        tempClient.publish(TOPICS.LED, JSON.stringify(comando), { qos: 0 }, (err) => {
          if (err) {
            console.error('Erro ao publicar:', err);
          } else {
            setLedLigado(!ledLigado);
            console.log(`Comando enviado com sucesso!`);
          }
          tempClient.end();
        });
      });
      
      tempClient.on('error', (err) => {
        console.error('Erro ao conectar cliente temporário:', err);
        tempClient.end();
      });
    } catch (error) {
      console.error('Erro ao alternar LED:', error);
    }
  }, [ledLigado]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f7ff" />
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.title}>🌡️ Painel IoT</Text>
        <Text style={styles.connectionStatus}>
          Status: <Text style={styles.statusText}>{connectionStatus}</Text>
        </Text>
      </View>

      {/* Painel de Sensores */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Leituras dos Sensores</Text>
        
        <SensorDisplay 
          label="Temperatura" 
          value={sensorData.temperatura} 
          unit="°C" 
        />
        
        <SensorDisplay 
          label="Umidade" 
          value={sensorData.umidade} 
          unit="%" 
        />
        
        <Text style={styles.lastUpdate}>
          Os dados são atualizados em tempo real via MQTT
        </Text>
      </View>

      {/* Controles */}
      <View style={styles.controlsContainer}>
        <Text style={styles.controlsTitle}>Controle de Dispositivos</Text>
        
        <ControlButton isOn={ledLigado} onPress={alternarLed} />
      </View>
      
      {/* Informações Educativas */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Como funciona?</Text>
        <Text style={styles.infoText}>
          Este aplicativo se comunica com dispositivos IoT usando o protocolo MQTT.
          Broker: wss://broker.hivemq.com:8884/mqtt
          SENSOR: 'fiap/iot/temphumi',
          LED: 'fiap/iot/led'
          Sensores de temperatura e umidade enviam dados em tempo real. O LED pode ser controlado remotamente.
          O aplicativo atualiza automaticamente as leituras dos sensores. O estado do LED é refletido na interface.
          O aplicativo é desenvolvido com React Native.
    
        </Text>
      </View>
    </View>
  );
}

// Estilos do aplicativo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f7ff',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2c3e50',
  },
  connectionStatus: {
    fontSize: 14,
    marginTop: 5,
  },
  statusText: {
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2c3e50',
  },
  sensorItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 4,
  },
  lastUpdate: {
    fontSize: 12,
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: 10,
  },
  controlsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2c3e50',
    alignSelf: 'flex-start',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonOn: {
    backgroundColor: '#e74c3c',  // Vermelho para desligar
  },
  buttonOff: {
    backgroundColor: '#2ecc71',  // Verde para ligar
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2980b9',
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
});