
# FrontMQTT + ESP32 IoT Dashboard

Projeto integrado de IoT com ESP32, sensor DHT22 e controle de LED via protocolo MQTT. A interface foi desenvolvida em **React Native com Expo**, permitindo o monitoramento em tempo real da temperatura, umidade e o controle remoto de atuadores.

![Demonstração do app](./assets/demo.gif)

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

```bash
# 1. Clone o repositório
git clone https://github.com/arnaldojr/mqtt-app-react-native.git
cd FrontMQTT

# 2. Instale as dependências
npm install

# 3. Inicie o app
npx expo start
```

> Use o QR code no navegador para abrir o app no Expo Go.


### Exemplo de broker gratuito:

- `broker.hivemq.com`, porta `1883` (TCP) ou `8884` (WSS)

---

## Testando com HiveMQ Web Client

Acesse [HiveMQ Websocket Client](https://www.hivemq.com/demos/websocket-client/) para:

- Publicar comandos manualmente
- Visualizar mensagens JSON publicadas pelo ESP32
