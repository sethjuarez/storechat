import {
  CosmosClient,
  Database,
  Container,
  SqlParameter,
  SqlQuerySpec,
} from "@azure/cosmos";
import { Prompt, Document } from "@types";

export interface Record {
  id: string;
}

export interface CosmosContext {
  endpoint: string;
  key: string;
  database: string;
}

export abstract class CosmosDataService<T extends Record> {
  protected context: CosmosContext;
  protected client: CosmosClient;
  protected databaseId: string;
  protected containerId: string;
  protected listQuery: string;
  protected partitionKey?: string;

  protected database?: Database;
  protected container?: Container;

  constructor(
    context: CosmosContext,
    containerId: string,
    listQuery: string,
    partitionKey?: string
  ) {
    this.context = context;
    this.client = new CosmosClient({
      endpoint: this.context.endpoint,
      key: this.context.key,
    });
    this.databaseId = this.context.database;
    this.containerId = containerId;
    this.listQuery = listQuery;
    this.partitionKey = partitionKey;
    // local mode
    if (this.context.endpoint.includes("localhost")) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
  }

  async init() {
    
    
    const dbResponse = await this.client.databases.createIfNotExists({
      id: this.databaseId,
    });
    this.database = dbResponse.database;
    if (this.partitionKey) {
      const response = await this.database.containers.createIfNotExists({
        id: this.containerId,
        partitionKey: this.partitionKey,
      });
      this.container = response.container;
    } else {
      const response = await this.database.containers.createIfNotExists({
        id: this.containerId,
      });
      this.container = response.container;
    }
  }

  async upsert(arg: T): Promise<any> {
    const result = await this.container?.items.upsert(arg);
    return result?.resource;
  }

  async fetch(querySpec: SqlQuerySpec): Promise<any> {
    const results = await this.container?.items.query(querySpec).fetchAll();
    return results?.resources;
  }

  async fetchList(parameters?: SqlParameter[]): Promise<any[]> {
    const querySpec: SqlQuerySpec = {
      query: this.listQuery,
      parameters: parameters,
    };
    const data = await this.fetch(querySpec);
    return data;
  }

  async get(id: string, partitionKeyValue?: string): Promise<T> {
    const item = this.container?.item(id, partitionKeyValue ?? id);
    const result = await item?.read();
    return result?.resource;
  }
}

export interface PromptRecord extends Record {
  prompts: Prompt[];
  selected: number;
}

export class PromptDataService extends CosmosDataService<PromptRecord> {
  constructor(context: CosmosContext) {
    super(context, "prompt", "SELECT * FROM c WHERE c.id = @id", "/id");
  }
}


export interface DocumentRecord extends Record {
  documents: Document[];
}

export class DocumentDataService extends CosmosDataService<DocumentRecord> {
  constructor(context: CosmosContext) {
    super(context, "document", "SELECT * FROM c WHERE c.id = @id", "/id");
  }
}