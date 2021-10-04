/**
 * Check if the given element exists in the DOM
 * @param  {String}  selector  Element selector
 * @param  {Boolean} falseCase Check if the element (does not) exists
 */
export default (selector, falseCase) => {
  /**
     * The element found in the DOM
     * @type {Int}
     */
  const element = $(selector)

  if (falseCase === true) {
    expect(element.elementId).to.be.a(
      'undefined',
      `Element with selector "${selector}" should not exist on the page`
    )
  } else {
    expect(element.elementId).to.be.a(
      'string',
      `Element with selector "${selector}" should exist on the page`
    )
  }
}
