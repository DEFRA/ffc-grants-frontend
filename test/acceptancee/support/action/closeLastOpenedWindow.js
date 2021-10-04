/**
 * Close the last opened window
 * @param  {String}   obsolete Type of object to close (window or tab)
 */

export default (obsolete) => {
  /**
     * The last opened window handle
     * @type {Object}
     */
  const lastWindowHandle = browser.getWindowHandles().slice(-1)[0]

  browser.closeWindow()
  browser.switchToWindow(lastWindowHandle)
}
