
window.onload = function () {
  const elements = document.querySelectorAll('input[type="checkbox"]')
  if (elements) {
    elements.forEach(function (checkBox) {
      checkBox.addEventListener('keypress', function (event) {
        event.preventDefault()
        if (event.which === 13) {
          this.checked = !this.checked
        }
      })
    })
  }
}
