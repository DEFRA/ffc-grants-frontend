const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
const { AdalFetchClient } = require('@pnp/nodejs-commonjs')
const { BlobServiceClient } = require('@azure/storage-blob')
const sharepointConfig = require('../config/sharepoint')
const blobStorageConfig = require('../config/blobStorage')
const wreck = require('@hapi/wreck')
const appInsights = require('../services/app-insights')
async function downloadFromBlobStorage (filename) {
  const blobServiceClient = BlobServiceClient.fromConnectionString(blobStorageConfig.connectionStr)
  const containerClient = blobServiceClient.getContainerClient(blobStorageConfig.containerName)
  const blockBlobClient = containerClient.getBlockBlobClient(filename)
  const buffer = await blockBlobClient.downloadToBuffer()
  console.log('Downloaded successfully')
  return { buffer, blockBlobClient }
}

async function uploadToSharePoint (buffer, filename, uploadLocation) {
  const client = new AdalFetchClient(sharepointConfig.tenantId, sharepointConfig.clientId, sharepointConfig.clientSecret)
  const accessToken = (await client.acquireToken()).accessToken

  // The following chars cause issues in sharepoint online file names so remove them: " * : < > ? / \ |
  const safeFilename = filename.replace(/["*:<>?/|\\]/g, '').trim()

  const uploadEndpoint =
      'https://graph.microsoft.com/v1.0/sites/' +
      sharepointConfig.siteId +
      '/drives/' +
      sharepointConfig.documentLibraryId +
      '/root:/' +
      encodeURIComponent(uploadLocation) +
      encodeURIComponent(safeFilename) +
      ':/content'

  console.log(uploadEndpoint)

  await wreck.put(
    uploadEndpoint,
    {
      payload: buffer,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
}

module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)

    const filename = body.filename
    const { buffer, blockBlobClient } = await downloadFromBlobStorage(filename)
    console.log(buffer)
    await uploadToSharePoint(buffer, filename, body.uploadLocation)

    // At a later date we can capture the response from this and check for any error codes
    await blockBlobClient.delete()
    console.log('Deleted successfully')

    await fileCreatedReceiver.completeMessage(msg)
    await protectiveMonitoringServiceSendEvent(msg.correlationId, 'FTF-FILE-SENT-TO-SHAREPOINT', '0706')
  } catch (err) {
    appInsights.logException(err, msg?.correlationId)
    await fileCreatedReceiver.abandonMessage(msg)
    console.error('Unable to process message')
    console.error(err)
  }
}
