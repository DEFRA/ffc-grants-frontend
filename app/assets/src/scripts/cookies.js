const acceptButton = document.querySelector('.js-cookies-button-accept')
const rejectButton = document.querySelector('.js-cookies-button-reject')
const acceptedBanner = document.querySelector('.js-cookies-accepted')
const rejectedBanner = document.querySelector('.js-cookies-rejected')
const questionBanner = document.querySelector('.js-question-banner')
const cookieBanner = document.querySelector('.js-cookies-banner')
const cookieContainer = document.querySelector('.js-cookies-container')
if (cookieContainer && cookieContainer.style) {
  cookieContainer.style.display = 'block'

  function showBanner (banner) {
    questionBanner.setAttribute('hidden', 'hidden')
    banner.removeAttribute('hidden')
    // Shift focus to the banner
    banner.setAttribute('tabindex', '-1')
    banner.focus()

    banner.addEventListener('blur', function () {
      banner.removeAttribute('tabindex')
    })
  }

  acceptButton.addEventListener('click', function (event) {
    showBanner(acceptedBanner)
    event.preventDefault()
    submitPreference(true)
  })

  rejectButton.addEventListener('click', function (event) {
    showBanner(rejectedBanner)
    event.preventDefault()
    submitPreference(false)
  })

  acceptedBanner.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
  })

  rejectedBanner.querySelector('.js-hide').addEventListener('click', function () {
    cookieBanner.setAttribute('hidden', 'hidden')
  })

  function submitPreference (accepted) {
    const crumbToken = window.document.getElementById('crumbBanner')
    window.fetch('/site-cookies', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        crumb: crumbToken.value
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({
        analytics: accepted,
        async: true,
        crumb: crumbToken.value
      })
    }).then(res => {
      console.log('Request complete! response:', res)
    })
  }
}
