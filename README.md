
# FrontMQTT + ESP32 IoT Dashboard

Projeto integrado de IoT com ESP32, sensor DHT22 e controle de LED via protocolo MQTT. A interface foi desenvolvida em [**Expo**](https://expo.dev/), permitindo o monitoramento em tempo real da temperatura, umidade e o controle remoto de atuadores.

## Funcionalidades

- Interface mobile com botão para **ligar/desligar LED**
- Leitura contínua de **temperatura e umidade**
- Comunicação bidirecional via **MQTT com JSON**


## Arquitetura

```
[ ESP32 + DHT22 ]
       │
    MQTT (JSON)
       │
[ Broker HiveMQ ]
       │
[ React Native (Expo) ]
```

### Frontend (React Native)

- **Node.js** e **npm**
- **Expo CLI**
- Celular com **Expo Go** instalado (ou emulador Android/iOS)

---

## Como executar o app mobile
- Instale as dependencias
```bash
npm install
```

- Inicie o app
```bash
npm start
```

> Use o QR code no navegador para abrir o app no Expo Go.


### Exemplo de broker gratuito:

- `broker.hivemq.com`, porta `1883` (TCP) ou `8884` (WSS)

---

## Testando com HiveMQ Web Client

Acesse [HiveMQ Websocket Client](https://www.hivemq.com/demos/websocket-client/) para:

- Publicar comandos manualmente
- Visualizar mensagens JSON publicadas pelo ESP32
