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

export interface ExtendedTurnResponse extends TurnResponse {
  message: string;
}

export interface Customer {
  image: string;
  name: string;
  age: number;
  location: string;
}


export interface RequestTelemetry {
  host: string;
  name: string;
  email: string;
  type: string;
  message: string;
  turn: TurnRequest;
}

export interface ResponseTelemetry {
  host: string;
  name: string;
  email: string;
  type: string;
  message: string;
  turn: TurnResponse;
}

export interface Prompt {
  template: string;
  name: string;
  created: string;
  modified: string;
}

export interface PromptState {
  prompts: Prompt[];
  selected: number;
}

export interface Document {
  file: string;
  keywords: string[];
  ignore: boolean;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  expires: string;
  status: "authenticated" | "loading" | "unauthenticated";
}