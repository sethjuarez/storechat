import * as moment from "moment-timezone";
import { AppContext, Principal } from "./global";
import {
  CosmosClient,
  Database,
  Container,
  SqlParameter,
  SqlQuerySpec,
} from "@azure/cosmos";

export interface Record {
  id: string;
  updated: Date;
  updateby: string;
}

export class AppContext {
  endpoint: string;
  key: string;
  database: string;
  debug: boolean;
  principal: Principal;

  createClient(): CosmosClient {
    return new CosmosClient({ endpoint: this.endpoint, key: this.key })
  }

  static create = function(env: NodeJS.ProcessEnv, ): AppContext {
    const context = new AppContext();
    context.endpoint = env.CosmosEndpoint;
    context.key = env.CosmosKey;
    context.database = env.CosmosDatabase;
    context.debug = env.debug == "true";
    if (context.endpoint.includes("https://localhost")) {
      env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    return context;
  }
};

export abstract class DataAccessObject<T extends Record> {
  protected client: CosmosClient;
  protected databaseId: string;
  protected containerId: string;
  protected listQuery: string;
  protected partitionKey?: string;

  protected context: AppContext;
  protected database: Database;
  protected container: Container;
  protected principal: Principal;

  constructor(
    context: AppContext,
    containerId: string,
    listQuery: string,
    partitionKey?: string
  ) {
    this.context = context;
    this.client = this.context.createClient();
    this.principal = this.context.principal;
    this.databaseId = this.context.database;
    this.containerId = containerId;
    this.listQuery = listQuery;
    this.partitionKey = partitionKey;
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
    if (this.principal.isAdmin() || this.principal.isEditor()) {
      arg.updated = new Date(moment.utc().format());
      arg.updateby = this.principal.email;
      const result = await this.container.items.upsert(arg);
      return result.resource;
    } else {
      return null;
    }
  }

  async fetch(querySpec: SqlQuerySpec): Promise<any> {
    const results = await this.container.items.query(querySpec).fetchAll();
    return results.resources;
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
    const item = this.container.item(id, partitionKeyValue ?? id);
    const result = await item.read();
    return result.resource;
  }
}
