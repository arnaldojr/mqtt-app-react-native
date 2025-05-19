import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createContext, PropsWithChildren } from "react";
import { PaperProvider } from "react-native-paper";
import {
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";

import merge from "deepmerge";
import { useCallback, useMemo, useState } from "react";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

type SettingsContextProps = {
  toggleTheme: () => void;
  isDark: boolean;
};

const SettingsContext = createContext<SettingsContextProps>(
  {} as SettingsContextProps
);

const SettingsProvider = ({ children }: PropsWithChildren) => {
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
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </SettingsContext.Provider>
  );
};

export { SettingsContext, SettingsProvider };
