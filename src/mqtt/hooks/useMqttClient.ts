import mqtt from "mqtt";
import { ConnectionStatus, OnMessageCallback } from "../types";
import { useCallback, useEffect, useState } from "react";

type useMqttClientProps = {
  status: ConnectionStatus;
  subscribe: (topic: string, onMessage: OnMessageCallback) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
  disconnect: () => void;
};

const useMqttClient = (options: mqtt.IClientOptions): useMqttClientProps => {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  const subscribe = useCallback(
    (topic: string, onMessage: OnMessageCallback) => {
      if (!client) return;
      setStatus("subscribing");

      client.subscribe(topic, (error) => {
        if (error) {
          setStatus("error");
          return;
        }
        setStatus("subscribed");
        client.on("message", (currentTopic, payload) => {
          const isWildCard = topic.at(-1) === "#";
          const subscribedTopic = isWildCard ? topic.slice(0, -2) : topic;
          if (!currentTopic.startsWith(subscribedTopic)) return;
          onMessage(topic, String(payload));
        });
      });
    },
    [client]
  );

  const unsubscribe = useCallback(
    (topic: string) => {
      if (!client) return;
      client.unsubscribe(topic);
    },
    [client]
  );

  const publish = useCallback(
    (topic: string, message: string) => {
      if (!client) return;
      client.publish(topic, message);
    },
    [client]
  );

  const disconnect = useCallback(() => {
    if (!client) return;
    client.end();
    setClient(undefined);
    setStatus("disconnected");
  }, [client]);

  useEffect(() => {
    if (!options) return;
    if (!options.host) return;

    const mqttClient = mqtt.connect(options);
    setClient(mqttClient);
    setStatus("connecting");

    mqttClient.on("connect", () => {
      setStatus("connected");
    });

    // Eventos de erro e reconexão
    mqttClient.on("error", (error) => {
      setStatus("error");
    });

    mqttClient.on("reconnect", () => {
      setStatus("reconnecting");
    });

    mqttClient.on("offline", () => {
      setStatus("disconnected");
    });

    mqttClient.on("end", () => {
      setStatus("ended");
    });

    // Limpeza ao desmontar o componente
    return () => {
      if (mqttClient) mqttClient.end();
    };
  }, [setClient, options]);

  return {
    status,
    subscribe,
    unsubscribe,
    publish,
    disconnect,
  };
};

export default useMqttClient;
