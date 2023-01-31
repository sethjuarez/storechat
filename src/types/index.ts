export interface Turn {
  message: string;
  status: "waiting" | "done";
  type: "user" | "bot";
}

export interface TurnRequest {
  prompt: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  stream: boolean;
}

export interface Choice {
  text: string;
  index: number;
  finish_reason: string;
  logprobs: number | null;
}

export interface Usage {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
}

export interface TurnResponse {
  choices: Choice[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: Usage;
}

export interface Customer {
  image: string;
  name: string;
  age: number;
  location: string;
}


export interface RequestTelemetry {
  type: string;
  message: string;
  name: string;
  email: string;
  turn: TurnRequest;
}

export interface ResponseTelemetry {
  type: string;
  message: string;
  name: string;
  email: string;
  turn: TurnResponse;
}