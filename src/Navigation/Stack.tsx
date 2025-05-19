import { createStackNavigator } from "@react-navigation/stack";
import Connection from "../Components/Connection";
import Panel from "../Components/Panel";
import { PanelStack } from "../types/navigation";
import { IconButton } from "react-native-paper";
import { useContext } from "react";
import { SettingsContext } from "../Context/SettingsContext";

const InnerStack = createStackNavigator<PanelStack>();

const Stack = () => {
  const { toggleTheme } = useContext(SettingsContext);
  return (
    <InnerStack.Navigator
      screenOptions={{
        headerRight: ({ tintColor }) => (
          <IconButton
            icon={"theme-light-dark"}
            onPress={toggleTheme}
            iconColor={tintColor}
          />
        ),
      }}
    >
      <InnerStack.Screen name="Connection" component={Connection} />
      <InnerStack.Screen name="Panel" component={Panel} />
    </InnerStack.Navigator>
  );
};

export default Stack;
