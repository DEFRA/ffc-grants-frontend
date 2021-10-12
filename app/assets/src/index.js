import { initAll } from 'govuk-frontend'
import './application.scss'
import './scripts/cookies'
import { assessibility } from './scripts/assessibility'
import { validation } from './scripts/validation'
import TimeoutWarning from '../../templates/components/timeout-warning/timeout-warning'
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (let i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}
window.addEventListener('load', (event) => {
  assessibility()
  validation()
})
initAll()
const $timeoutWarnings = document.querySelectorAll('[data-module="govuk-timeout-warning"]')
nodeListForEach($timeoutWarnings, function ($timeoutWarning) {
  new TimeoutWarning($timeoutWarning).init()
})
