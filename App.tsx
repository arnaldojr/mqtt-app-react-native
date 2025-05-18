import { MqttProvider } from "./src/mqtt/Context/MqttContext";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import Stack from "./src/Navigation/Stack";
import { PaperProvider } from "react-native-paper";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";

import merge from "deepmerge";
import { useCallback, useMemo, useState } from "react";
import { SettingsContext } from "./src/Context/SettingsContext";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

export default function App() {
  const [isDark, setIsThemeDark] = useState(false);

  const theme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = useCallback(() => {
    return setIsThemeDark(!isDark);
  }, [isDark]);

  const preferences = useMemo(
    () => ({
      toggleTheme,
      isDark,
    }),
    [toggleTheme, isDark]
  );

  return (
    <SettingsContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <MqttProvider>
          <NavigationContainer theme={theme}>
            <Stack />
          </NavigationContainer>
        </MqttProvider>
      </PaperProvider>
    </SettingsContext.Provider>
  );
}
