import { initAll } from 'govuk-frontend'
import './application.scss'
import './scripts/cookies'
import { assessibility } from './scripts/assessibility'
import { validation } from './scripts/validation'
window.addEventListener('load', (event) => {
    assessibility()
    validation()
});
initAll()
