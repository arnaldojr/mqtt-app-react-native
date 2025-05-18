import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import {
  Button,
  Menu,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { IClientOptions, MqttProtocol } from "mqtt";
import { MqttContext } from "../mqtt/Context/MqttContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PanelStack } from "../types/navigation";

const Connection = () => {
  const { connect } = useContext(MqttContext);
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp<PanelStack>>();

  const [hidePassword, setHidePassword] = useState(true);
  const [showProtocolOptions, setShowProtocolOptions] = useState(false);
  const [options, setOptions] = useState<IClientOptions>({
    host: "broker.hivemq.com",
    port: 8884,
    path: "/mqtt",
    protocol: "wss",
  });

  const setProtocol = (protocol: MqttProtocol) => {
    setOptions((previous) => ({ ...previous, protocol }));
    setShowProtocolOptions(false);
  };

  const handleInputChange = (field: keyof IClientOptions) => {
    return (text: string) => {
      setOptions((previous) => ({ ...previous, [field]: text }));
    };
  };

  const startConnection = () => {
    connect(options);
    navigation.navigate("Panel");
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: colors.background,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
      >
        <Surface elevation={0} style={styles.container}>
          <Text variant="headlineLarge">
            Informe os dados para se conectar no servidor MQTT
          </Text>
          <TextInput
            mode="outlined"
            label="Servidor"
            placeholder="broker.hivemq.com"
            onChangeText={handleInputChange("host")}
            value={options.host}
          />
          <TextInput
            mode="outlined"
            label="Porta"
            placeholder="8884"
            onChangeText={handleInputChange("port")}
            value={options.port?.toString()}
          />
          <TextInput
            mode="outlined"
            label="Caminho"
            placeholder="/mqtt"
            onChangeText={handleInputChange("path")}
            value={options.path}
          />
          <TextInput
            mode="outlined"
            label="Username"
            placeholder="Nome do usuário"
            onChangeText={handleInputChange("username")}
            value={options.username}
          />
          <TextInput
            mode="outlined"
            label="Password"
            placeholder="Digite a senha"
            onChangeText={handleInputChange("password")}
            value={options.password?.toString()}
            secureTextEntry={hidePassword}
            right={
              <TextInput.Icon
                icon="eye"
                onPress={() => setHidePassword(!hidePassword)}
              />
            }
          />
          <Menu
            visible={showProtocolOptions}
            onDismiss={() => setShowProtocolOptions(false)}
            anchor={
              <Button onPress={() => setShowProtocolOptions(true)}>
                {options.protocol || "Selecione o protocolo"}
              </Button>
            }
          >
            <Menu.Item title="wss" onPress={() => setProtocol("wss")} />
            <Menu.Item title="ws" onPress={() => setProtocol("ws")} />
            <Menu.Item title="mqtt" onPress={() => setProtocol("mqtt")} />
            <Menu.Item title="mqtts" onPress={() => setProtocol("mqtts")} />
          </Menu>
          <Button mode="contained" onPress={startConnection}>
            Conectar
          </Button>
        </Surface>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 20,
    justifyContent: "flex-start",
  },
});

export default Connection;
