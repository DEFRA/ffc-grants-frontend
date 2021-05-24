const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('../config/blob-storage')
let blobServiceClient

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccountName}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const blobContainerClient = blobServiceClient.getContainerClient(config.containerName)

async function downloadFile (filename) {
  const blockBlobClient = blobContainerClient.getBlockBlobClient(filename)
  const buffer = await blockBlobClient.downloadToBuffer()
  console.log('Blob Storage downloaded successfully')
  return { buffer, blockBlobClient }
}

async function deleteFile (blockBlobClient) {
  // At a later date we can capture the response from this and check for any error codes
  await blockBlobClient.delete()
  console.log('Blob storage deleted successfully')
}

module.exports = { downloadFile, deleteFile }
