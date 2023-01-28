export interface Turn {
  message: string;
  status: "waiting" | "done";
  type: "user" | "bot";
}
