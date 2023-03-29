 import {
  TurnResponse,
  TurnRequest,
  Customer,
  Turn,
  User
} from "@types";
import { IAppInsights } from "@microsoft/applicationinsights-common";

export class JsonService<Request, Response> {
  private _url: string;
  private _method: string;

  constructor(url: string, method: "POST" | "GET" = "POST") {
    this._url = url;
    this._method = method;
  }

  call = async (request: Request): Promise<Response> => {
    const options = {
      method: this._method,
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(this._url, options);
    const typed: Response = await response.json();
    return typed;
  };
}

export class PromptService extends JsonService<TurnRequest, TurnResponse> {
  private _template: string;
  private _document: string;
  private _customer: Customer;
  private _telemetry: { host: string; name: string; email: string };
  private _insights: IAppInsights;

  constructor(
    template: string,
    document: string,
    customer: Customer,
    user: User,
    insights: IAppInsights
  ) {
    super("/api/chat");
    this._template = template;
    this._document = document;
    this._customer = customer;
    this._telemetry = {
      host: window ? window.location.hostname : "unknown",
      name: user.name,
      email: user.email,
    };
    this._insights = insights;
  }

  createPrompt = (message: string, chat: Turn[]) => {
    // token replacement on base template
    let prompt = this._template
      .replaceAll("{name}", this._customer.name)
      .replaceAll("{age}", this._customer.age.toString())
      .replaceAll("{location}", this._customer.location)
      .replace("{message}", message);

    // documentation (if !exists kills token)
    prompt = prompt.replace("{documentation}", this._document);

    // conversation
    const conversation = chat
      .slice(-4)
      .reduce(
        (acc, cur) =>
          `${acc}${
            cur.type === "user"
              ? this._customer.name + ": " + cur.message + "\n"
              : "John: " + cur.message + "\n"
          }`,
        ""
      );

    return prompt.replace("{conversation}", conversation.trim());
  };

  createRequest = (message: string, chat: Turn[]): TurnRequest => {
    const turn = {
      prompt: this.createPrompt(message, chat),
      temperature: 0.8,
      top_p: 1.0,
      max_tokens: 500,
      stream: false,
    };

    

    this._insights.trackEvent(
      { name: "request" },
      {
        ...this._telemetry,
        type: "request",
        message: message,
        turn: turn,
      }
    );

    return turn;
  };

  prompt = async (request: TurnRequest): Promise<string> => {
    // get response
    const response = await this.call(request);
    // clean it up
    let reply = response.choices[0].text
      .split(this._customer.name + ": ")[0]
      .split("# Conclusion")[0]
      .split("In this conversation")[0]
      .split("# Change Log")[0]
      .trim();

    // odd character creeping in
    reply = reply.split("§")[0].trim();

    this._insights.trackEvent(
      { name: "response" },
      {
        ...this._telemetry,
        type: "response",
        message: reply,
        turn: response,
      }
    );
    
    return reply;
  };
}
