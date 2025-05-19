import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ConnectionStatus, OnMessageCallback } from "../types";
import useMqttClient from "../hooks/useMqttClient";
import { IClientOptions } from "mqtt";

type MqttContextProps = {
  status?: ConnectionStatus;
  subscribe: (topic: string, onMessage: OnMessageCallback) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
  connect: (options: IClientOptions) => void;
  disconnect: () => void;
};

const MqttContext = createContext<MqttContextProps>({} as MqttContextProps);

const MqttProvider = ({ children }: PropsWithChildren) => {
  const [options, setOptions] = useState<IClientOptions>({} as IClientOptions);

  const {
    status,
    subscribe: mqttSubscribe,
    disconnect,
    unsubscribe: mqttUnsubscribe,
    publish,
  } = useMqttClient(options);

  const connect = (options: IClientOptions) => {
    setOptions({
      ...options,
    });
  };

  const subscribe = (topic: string, onMessage: OnMessageCallback) => {
    mqttSubscribe(topic, onMessage);
  };

  const unsubscribe = (topic: string) => {
    mqttUnsubscribe(topic);
  };

  return (
    <MqttContext.Provider
      value={{
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        publish,
        status,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export { MqttContext, MqttProvider };
