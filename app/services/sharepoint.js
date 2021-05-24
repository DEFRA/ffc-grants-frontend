const config = require('../config/sharepoint')
const { AdalFetchClient } = require('@pnp/nodejs-commonjs')
const wreck = require('@hapi/wreck')

const tokenClient = new AdalFetchClient(config.tenantId, config.clientId, config.clientSecret)
const msGraphURL = 'https://graph.microsoft.com/v1.0/sites/'
let siteId = null
let documentLibraryId = null

async function setup () {
  console.log('Getting SharePoint Site and Document Library ID ...')
  const accessToken = (await tokenClient.acquireToken()).accessToken
  const siteIdEndpoint = msGraphURL + config.hostname + ':/' + config.sitePath

  const siteIdResponse = await wreck.get(
    siteIdEndpoint,
    { headers: { Authorization: `Bearer ${accessToken}` }, json: true }
  )

  siteId = siteIdResponse.payload.id

  const drivesEndpoint = msGraphURL + siteId + '/drives'

  const drivesResponse = await wreck.get(
    drivesEndpoint,
    { headers: { Authorization: `Bearer ${accessToken}` }, json: true }
  )

  documentLibraryId = drivesResponse.payload.value.find(drive => drive.name === config.documentLibrary).id
  console.log('Done')
}

async function uploadFile (buffer, filename, uploadLocation) {
  if (!siteId || !documentLibraryId) {
    await setup()
  }

  // The following chars cause issues in sharepoint online file names so remove them: " * : < > ? / \ |
  const safeFilename = filename.replace(/["*:<>?/|\\]/g, '').trim()

  const uploadEndpoint = msGraphURL + siteId +
      '/drives/' + documentLibraryId +
      '/root:/' + encodeURIComponent(uploadLocation) + encodeURIComponent(safeFilename) + ':/content'

  const accessToken = (await tokenClient.acquireToken()).accessToken

  await wreck.put(
    uploadEndpoint,
    {
      payload: buffer,
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  )

  console.log('Uploaded file to SharePoint')
}

module.exports = { setup, uploadFile }
