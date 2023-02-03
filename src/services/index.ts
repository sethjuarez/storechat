import { isNotNullOrUndefined } from "@microsoft/applicationinsights-core-js";
import {
  TurnResponse,
  TurnRequest,
  Customer,
  Turn,
  ExtendedTurnResponse,
} from "@types";

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

export class DocumentService {
  private _sources: { [id: string]: string };
  constructor() {
    // TODO: perhaps abstract sources to store
    this._sources = {
      food: "/data/NaturesNourishment.txt",
      clean: "/data/EcoClean.txt",
    };
  }

  search = async (prompt: string): Promise<string> => {
    let doc = "";
    Object.entries(this._sources).forEach(([key, value]) => {
      console.log(key, value, prompt);
      if (prompt.toLowerCase().includes(key.toLowerCase())) doc = value;
    });

    if (doc.length > 0) {
      const documentation = await fetch(doc, {
        method: "GET",
        headers: {
          "Content-Type": "application/text",
        },
      });

      const contents = await documentation.text();
      return contents;
    }

    return "";
  };
}

export class PromptService extends JsonService<TurnRequest, TurnResponse> {
  private _template: string;
  private _document: string;
  private _customer: Customer;

  constructor(template: string, document: string, customer: Customer) {
    super("/api/chat");
    this._template = template;
    this._document = document;
    this._customer = customer;
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
              : "Assistant: " + cur.message + "\n"
          }`,
        ""
      );

    return prompt.replace("{conversation}", conversation);
  };

  createRequest = (message: string, chat: Turn[]): TurnRequest => {
    return {
      prompt: this.createPrompt(message, chat),
      temperature: 0.8,
      top_p: 1.0,
      max_tokens: 500,
      stream: false,
    };
  };

  prompt = async (request: TurnRequest): Promise<ExtendedTurnResponse> => {
    // get response
    const response = await this.call(request);
    // clean it up
    const reply = response.choices[0].text
      .split(this._customer.name + ": ")[0]
      .trim();
    return { ...response, message: reply };
  };
}
