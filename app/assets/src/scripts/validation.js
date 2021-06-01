export function validation () {
  let elements = document.querySelectorAll('input[type="checkbox"]')
  if (elements) {
    elements = Array.from(elements)
    const noneOfAbove = elements.filter(e => e.value === 'None of the above')
    if (noneOfAbove && noneOfAbove.length === 1) {
      noneOfAbove[0].addEventListener('change', function (event) {
        event.preventDefault()
        const elementsExpectNonOfAbove = elements.filter(e => e.value !== 'None of the above')
        elementsExpectNonOfAbove.forEach(function (checkBox) {
          checkBox.disabled = noneOfAbove[0].checked
          checkBox.checked = false
        })
      })
      // in case you back to this page
      if (noneOfAbove[0].checked) {
        const e = new Event('change')
        noneOfAbove[0].dispatchEvent(e)
      }
    }
  }
}
