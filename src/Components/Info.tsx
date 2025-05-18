import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dialog, FAB, Portal, Text } from "react-native-paper";

const Info = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <FAB
        icon="information-outline"
        style={styles.fab}
        onPress={() => setIsVisible(true)}
      />
      <Portal>
        <Dialog onDismiss={() => setIsVisible(false)} visible={isVisible}>
          <Dialog.Icon icon="information-outline" />
          <Dialog.Title>Como funciona?</Dialog.Title>
          <Dialog.ScrollArea style={styles.dialogContent}>
            <Text variant="bodyMedium">
              Este aplicativo se comunica com dispositivos IoT usando o
              protocolo MQTT.
            </Text>
            <Text variant="bodyMedium">
              Broker: wss://broker.hivemq.com:8884/mqtt
            </Text>
            <Text variant="bodyMedium">SENSOR: 'fiap/iot/temphumi'</Text>
            <Text variant="bodyMedium">
              LED: 'fiap/iot/led' Sensores de temperatura e umidade enviam dados
              em tempo real.
            </Text>
            <Text variant="bodyMedium">
              O LED pode ser controlado remotamente.
            </Text>
            <Text variant="bodyMedium">
              O aplicativo atualiza automaticamente as leituras dos sensores.{" "}
            </Text>
            <Text variant="bodyMedium">
              O estado do LED é refletido na interface.{" "}
            </Text>
            <Text variant="bodyMedium">
              O aplicativo é desenvolvido com Expo.
            </Text>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  dialogContent: {
    paddingVertical: 20,
    gap: 5,
  },
});

export default Info;
