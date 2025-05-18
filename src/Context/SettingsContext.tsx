import { createContext } from "react";

type SettingsContextProps = {
  toggleTheme: () => void;
  isDark: boolean;
};

const SettingsContext = createContext<SettingsContextProps>(
  {} as SettingsContextProps
);

export { SettingsContext };
