import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

type SensorDisplayProps = {
  icon: string;
  value?: string;
  unit: string;
  color?: string;
};

const SensorDisplay = ({ icon, value, unit, color }: SensorDisplayProps) => {
  return (
    <View style={styles.sensorItem}>
      <Icon source={icon} size={64} color={color} />
      <Text variant="bodySmall">{`${value || "---"} ${unit}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sensorItem: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
});

export default SensorDisplay;
