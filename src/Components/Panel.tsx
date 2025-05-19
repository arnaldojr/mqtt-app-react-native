import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import SensorDisplay from "./SensorDisplay";
import { MqttContext } from "../mqtt/Context/MqttContext";
import {
  Card,
  IconButton,
  List,
  Switch,
  TextInput,
  Text,
  useTheme,
  Surface,
} from "react-native-paper";
import Info from "./Info";

type SensorData = {
  temperature?: number;
  humidity?: number;
  ledStatus?: "on" | "off";
};

const Panel = () => {
  const { colors } = useTheme();
  // Estados para armazenar os dados dos sensores e atuadores
  const { status, disconnect, subscribe, publish, unsubscribe } =
    useContext(MqttContext);
  const [sensorData, setSensorData] = useState<SensorData>();
  const [topic, setTopic] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([]);

  const onMessage = useCallback((topic: string, message: string) => {
    try {
      // Converter a mensagem para objeto JSON
      const payload = JSON.parse(message.toString());

      setSensorData((previous) => ({
        ...previous,
        ...payload,
      }));
    } catch (error) {
      console.warn("Erro ao processar mensagem:", JSON.stringify(error));
    }
  }, []);

  const toggleLed = () => {
    const updatedLed: SensorData = {
      ledStatus: sensorData?.ledStatus === "on" ? "off" : "on",
    };
    setSensorData((previous) => ({
      ...(previous || ({} as SensorData)),
      ...updatedLed,
    }));

    publish("iot/led", JSON.stringify(updatedLed));
  };

  const subscribeToTopic = () => {
    setTopics((previous) => [...previous, topic]);
    setTopic("");
    subscribe(topic, onMessage);
  };

  const unsubscribeTopic = (topic: string) => {
    setTopics((previous) => previous.filter((item) => item !== topic));
    unsubscribe(topic);
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return (
    <Surface style={styles.container}>
      {/* Cabeçalho */}
      <Surface elevation={0}>
        <Text variant="headlineLarge">🌡️ Painel IoT</Text>
        <Text variant="titleLarge">Status: {status!}</Text>
      </Surface>

      <View style={styles.topics}>
        <TextInput
          disabled={status !== "connected" && status !== "subscribed"}
          placeholder="Digite o tópico que gostaria de se inscrever"
          onChangeText={setTopic}
          value={topic}
          right={<TextInput.Icon icon="plus" onPress={subscribeToTopic} />}
        />
        {topics.length > 0 && (
          <FlatList
            horizontal={true}
            data={topics}
            keyExtractor={() => Math.random().toString()}
            renderItem={({ item }) => (
              <List.Item
                title={item}
                right={() => (
                  <IconButton
                    icon={"delete"}
                    onPress={() => unsubscribeTopic(item)}
                  />
                )}
              />
            )}
          />
        )}
      </View>

      {/* Painel de Sensores */}
      <Card style={styles.card}>
        <Card.Title title="Leituras dos Sensores" />
        <Card.Content
          style={{ flexDirection: "row", justifyContent: "space-around" }}
        >
          <SensorDisplay
            icon="thermometer"
            value={sensorData?.temperature?.toString()}
            color="red"
            unit="°C"
          />

          <SensorDisplay
            icon="water-percent"
            value={sensorData?.humidity?.toString()}
            color="blue"
            unit="%"
          />
        </Card.Content>
        <Card.Actions>
          <Text variant="bodySmall">
            Os dados são atualizados em tempo real via MQTT
          </Text>
        </Card.Actions>
      </Card>

      {/* Controles */}
      <Card style={styles.card}>
        <Card.Title
          title="Led"
          right={() => (
            <Switch
              value={sensorData?.ledStatus === "on"}
              onValueChange={toggleLed}
            />
          )}
        />
      </Card>

      <Info />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  topics: {
    marginTop: 10,
  },
  card: {
    marginTop: 10,
  },
});

export default Panel;
