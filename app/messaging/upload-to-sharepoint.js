module.exports = async function (msg, fileCreatedReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)
    await fileCreatedReceiver.completeMessage(msg)
  } catch (err) {
    console.err('Unable to process message')
    console.err(err)
    await fileCreatedReceiver.abandonMessage(msg)
  }
}
