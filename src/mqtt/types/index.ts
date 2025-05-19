type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error"
  | "reconnecting"
  | "subscribing"
  | "subscribed"
  | "ended";

type OnMessageCallback = (topic: string, message: string) => void;

export { ConnectionStatus, OnMessageCallback };
