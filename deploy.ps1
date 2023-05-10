$resourcegroupname = "organicstorechat"
$deploymentname = $resourcegroupname + "deployment"
$settingsfile = ".env.local"

az group create -l southcentralus -n $resourcegroupname
az deployment group create --resource-group $resourcegroupname --template-file azureservices.bicep --name $deploymentname

## Create AaD App registration & secret and retrieve AAD specifics for nextauth
az extension add --name account
az ad app create --display-name $resourcegroupname --reply-urls http://localhost:3000/api/auth/callback/azure-ad
$AZURE_AD_CLIENT_ID=$(az ad app create --display-name $resourcegroupname --query appId --output tsv)
$AZURE_AD_CLIENT_SECRET=$(az ad app credential reset --id $AZURE_AD_CLIENT_ID  --append  --years 2 --query password --output tsv)
$AZURE_AD_TENANT_ID=$(az account tenant list --query [0].tenantId --output tsv)

## Helper to write variables to file
function getvaluebasedonkey($key) {
    $value = ((az deployment group show -g $resourcegroupname -n  $deploymentname --query properties.outputs.$key.value).ToString().Trim('"'))
    return $value
}
## Local stuff
$NODE_ENV="development"
$NEXTAUTH_SECRET="# you can generate a secret with `openssl rand -base64 32` (if you use windows, you can use wsl for that)"
$NEXTAUTH_URL="http://localhost:3000"

## Azure OpenAi stuff
$CHATGPT_KEY_VALUE = getvaluebasedonkey("chatgpT_KEY")
$ChatGPT_SERVICE_NAME_VALUE = getvaluebasedonkey("openAiEndpoint")
$CHATGPT_DEPLOYMENT_NAME = getvaluebasedonkey("openAiDeploymentName")
$CHATGPT_API_VERSION = getvaluebasedonkey("openAIDeploymentApiVersion")
$CHATGPT_FULL_URL = $ChatGPT_SERVICE_NAME_VALUE,"openai/deployments/",$CHATGPT_DEPLOYMENT_NAME,"/chat/completions?api-version=",$CHATGPT_API_VERSION -join ""

## Azure App Insights stuff
$NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_VALUE = getvaluebasedonkey("nexT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING")

## Cosmos DB stuff
$COSMOS_ENDPOINT_VALUE = getvaluebasedonkey("cosmoS_ENDPOINT")
$COSMOS_KEY_VALUE = getvaluebasedonkey("cosmoS_KEY")
$COSMOS_DATABASE_VALUE = getvaluebasedonkey("cosmoS_DATABASE")


## Write to output file
if (-not(Test-Path $settingsfile)) {
    <# Action to perform if the condition is true #>
Out-File -FilePath $settingsfile -Force

Write-Output "CHATGPT_URI=$CHATGPT_FULL_URL"  >> $settingsfile
Write-Output "CHATGPT_KEY=$CHATGPT_KEY_VALUE"  >> $settingsfile
Write-Output "NEXT_PUBLIC_APP_INSIGHTS_CONNECTION=$NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_VALUE"  >> $settingsfile
Write-Output "AZURE_AD_TENANT_ID=$AZURE_AD_TENANT_ID"  >> $settingsfile
Write-Output "AZURE_AD_CLIENT_ID=$AZURE_AD_CLIENT_ID"  >> $settingsfile
Write-Output "AZURE_AD_CLIENT_SECRET=$AZURE_AD_CLIENT_SECRET"  >> $settingsfile
Write-Output "NODE_ENV=$NODE_ENV"  >> $settingsfile
Write-Output "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"  >> $settingsfile
Write-Output "NEXTAUTH_URL=$NEXTAUTH_URL"  >> $settingsfile
Write-Output "COSMOS_ENDPOINT=$COSMOS_ENDPOINT_VALUE"  >> $settingsfile
Write-Output "COSMOS_KEY=$COSMOS_KEY_VALUE"  >> $settingsfile
Write-Output "COSMOS_DATABASE=$COSMOS_DATABASE_VALUE"  >> $settingsfile
}
else {
    Write-Host "The settings file was already generated. If you want to generate a new one, please delete the file first."
}


$MyRawString = Get-Content -Raw $settingsfile
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllLines($settingsfile, $MyRawString, $Utf8NoBomEncoding)