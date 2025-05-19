import { MqttProvider } from "./src/mqtt/Context/MqttContext";
import Stack from "./src/Navigation/Stack";

import { SettingsProvider } from "./src/Context/SettingsContext";

export default function App() {
  return (
    <SettingsProvider>
      <MqttProvider>
        <Stack />
      </MqttProvider>
    </SettingsProvider>
  );
}
