@description('Location where all resources will be deployed. This value defaults to the **South Central US** region.')
@allowed([
  'South Central US'
  'East US'
  'westeurope'
])
param location string = 'South Central US'

@description('''
Unique name for the chat application.  The name is required to be unique as it will be used as a prefix for the names of these resources:
- Azure Cosmos DB
- Azure App Service
- Azure OpenAI
The name defaults to a unique string generated from the resource group identifier.
''')
param name string = uniqueString(resourceGroup().id)

@description('Boolean indicating whether Azure Cosmos DB free tier should be used for the account. This defaults to **false**.')
param cosmosDbEnableFreeTier bool = false

@description('Specifies the SKU for the Azure OpenAI resource. Defaults to **S0**')
@allowed([
  'S0'
])
param openAiSku string = 'S0'

var openAiSettings = {
  name: '${name}-openai'
  sku: openAiSku
  maxConversationTokens: '2000'
  model: {
    name: 'gpt-35-turbo'
    version: '0301'
    deployment: {
      name: 'chat'
    }
  }
}

var cosmosDbSettings = {
  name: '${name}-cosmos-nosql'
  enableFreeTier: cosmosDbEnableFreeTier
  database: {
    name: 'chatdatabase'
  }
  container: {
    name: 'chatcontainer'
    throughput: 400
  }
}



resource cosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' = {
  name: cosmosDbSettings.name
  location: location
  kind: 'GlobalDocumentDB'
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    databaseAccountOfferType: 'Standard'
    enableFreeTier: cosmosDbSettings.enableFreeTier
    locations: [
      {
        failoverPriority: 0
        isZoneRedundant: false
        locationName: location
      }
    ]
  }
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-08-15' = {
  parent: cosmosDbAccount
  name: cosmosDbSettings.database.name
  properties: {
    resource: {
      id: cosmosDbSettings.database.name
    }
  }
}

resource cosmosDbContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-08-15' = {
  parent: cosmosDbDatabase
  name: cosmosDbSettings.container.name
  properties: {
    resource: {
      id: cosmosDbSettings.container.name
      partitionKey: {
        paths: [
          '/sessionId'
        ]
        kind: 'Hash'
        version: 2
      }
      indexingPolicy: {
        indexingMode: 'Consistent'
        automatic: true
        includedPaths: [
          {
            path: '/sessionId/?'
          }
          {
            path: '/type/?'
          }
        ]
        excludedPaths: [
          {
            path: '/*'
          }
        ]
      }
    }
    options: {
      throughput: cosmosDbSettings.container.throughput
    }
  }
}

resource openAiAccount 'Microsoft.CognitiveServices/accounts@2022-12-01' = {
  name: openAiSettings.name
  location: location
  sku: {
    name: openAiSettings.sku
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: openAiSettings.name
    publicNetworkAccess: 'Enabled'
  }
}

resource openAiModelDeployment 'Microsoft.CognitiveServices/accounts/deployments@2022-12-01' = {
  parent: openAiAccount
  name: openAiSettings.model.deployment.name
  properties: {
    model: {
      format: 'OpenAI'
      name: openAiSettings.model.name
      version: openAiSettings.model.version
    }
    scaleSettings: {
      scaleType: 'Standard'
    }
  }
}


resource workspace 'Microsoft.OperationalInsights/workspaces@2020-10-01' = {
  name: '${name}-workspace'
  location: location

}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02-preview' = {
  name: '${name}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspace.id
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
    
  }

}


output openAiEndpoint string = openAiAccount.properties.endpoint
output openAiDeploymentId string = openAiModelDeployment.id
output openAiDeploymentName string = openAiModelDeployment.name
output openAIDeploymentApiVersion string = openAiModelDeployment.apiVersion
output COSMOS_ENDPOINT string = cosmosDbAccount.properties.documentEndpoint
output COSMOS_KEY string = cosmosDbAccount.listKeys().primaryMasterKey
output COSMOS_DATABASE string = cosmosDbDatabase.name
output CHATGPT_KEY string = openAiAccount.listKeys().key1
output NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString
