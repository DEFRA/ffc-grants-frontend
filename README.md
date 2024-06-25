# FFC Grants Frontend

Frontend microservice for web front end of the application. It contains simple grant questions journey to check where applicant is elibible for water grants or not. On submission of application data is pulled from Redis and submited to eligibility service.

Evaluation happen is two step:

- Common eligibility questions - unable to answer these questions correctly will make application eligible.
- Scoring questions - these are project spcefic questions which send to scoring service and return respose with score, which give possibility of application chances.

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.


## Project Description

This repository contains all the code for the Front end (water) grant frontend application, which provides a series of questions for a user to determine what they need from the grant application, if the grant is something they can apply for and how strong their application is. If the user finishes the application, it also submits their answers along with their contact details for review.

The strength of the application is checked via a request sent to and received from the **ffc-grants-desirability-scoring** service using Azure Service Bus Session Queues, and the users' answers and details are submitted via a request sent to the **ffc-grants-desirability-notification** service using an Azure Service Bus Topic


## Project Requirements

This application requires the following to be run locally:

- Node
- Docker
- Access to Azure, and the Azure SND environment
- A running instance of **ffc-grants-desirability-scoring** (This is optional, and only needed if navigating to or past the _/score_ page)
 - This also means you will need PostgreSQL, with the latest Front end (water) DB script containing the Front end (water)  Scoring algorithm
 - This also means you will need A DEFRA VPN connection (AKA being connected to OpenVPN)
- A running instance of **ffc-grants-desirability-notification** (This is optional, and only needed for sending/receiving the Email after the application is complete)

### Environment Variables

There are many required Environment Variables needed for this project, which would be saved in a .env file. The following is a list of all of these, with a brief description of what they are needed/used for:

Environment Variable Name | Brief Description | Example (if needed)
--- | --- | ---
PORT | Used to Determine what Port the application should run on when running locally. Usually this is set to 3600 | 3600
SERVICE_BUS_HOST | The Azure Host Address that contains the necessary Service Buses | N/A
SERVICE_BUS_PASSWORD | The password in order to access the Azure Service Buses | N/A
SERVICE_BUS_USER | The user in order to access the Azure Service Buses | N/A
COOKIE_PASSWORD | The password needed for authorizing the cookies | N/A
BACKEND_POLLING_HOST | The localhost address for Backend Polling (This should be the full localhost address and should ***not*** have the same port as specified in **PORT** ) | http://localhost:3021/
NODE_ENV | The environemnt to be used locally (this is only needed for things like the cookie authentication etc) | dev
SITE_URL | The url of the local application (This should have the same port number used in **PORT**) | localhost:3600
APPINSIGHT_INSTRUMENTATION_KEY | The key needed to connect to App Insights | N/A
REDIS_HOSTNAME | The hostname needed for connecting to Azure Redis | N/A
REDIS_PORT | The port needed for connecting to Azure Redis | N/A
REDIS_PASSWORD | The password needed for connecting to Azure Redis | N/A
REDIS_PARTITION | The name of the application, needed for Azure Redis | ffc-grants-frontend
SERVER_TIMEOUT | How long the server timeout should be when running loclaly | 5
--- | ---  | ---
SCORE_REQUEST_QUEUE_ADDRESS | The name of the Azure Service Bus Queue used for sending the score request (without the users initials) | ffc-grants-queue-req
SCORE_RESPONSE_QUEUE_ADDRESS | The name of the Azure Service Bus Queue used for receiving the score data from the scoring service (without the users initials) | ffc-grants-queue-res
MESSAGE_QUEUE_SUFFIX | The users initials, which would be used at the end of the scoring queues | -zd
--- | --- | ---
LOGIN_REQUIRED | A vaiable to determine whether the login screen should be active or not (Optional, app automatically sets to false if this is absent) | false
AUTH_USERNAME | The username needed for the login screen (Optional, only needed if LOGIN_REQUIRED is true) | grants
AUTH_PASSWORD_HASH | The password needed for the login screen (Optional, only needed if LOGIN_REQUIRED is true) | grants
--- | --- | ---
NOTIFY_EMAIL_TEMPLATE | The email template needed for the application | N/A
NOTIFY_EMAIL_VERANDA_TEMPLATE | The email template needed if veranda journey is selected for the application | N/A
WORKSHEET_HIDE_EMPTY_ROWS | A true/false value to determine if empty rows in the DORA excel sheet should be hidden (defaults to true) | true
WORKSHEET_PROTECT_ENABLED | A true/false value to determine if the DORA excel sheet should be protected (defaults to false) | false
SEND_EMAIL_TO_RPA |A true/false value to determine if the generated email should be sent to RPA (default to false) | false
WORKSHEET_PROTECT_PASSWORD | The password to protect the DORA excel sheet | N/A
EXCEL_UPLOAD_ENVIRONMENT | The environment to upload the DORA excel sheet to | DEV
DESIRABILITY_SUBMITTED_TOPIC_ADDRESS | The name of the Azure Service Bus Topic used for sending the Email and DORA details | ffc-grants-topic
--- | --- | ---
GOOGLE_TAG_MANAGER_KEY | The key needed to connect to Google Tag Manager (Optional, only required if needing to send analytics to Google Analytics) | N/A
GOOGLE_TAG_MANAGER_SERVER_KEY | The server key needed to connect to Google Tag Manager (Optional, only required if needing to send analytics to Google Analytics) | N/A
ANALYTICS_PROPERTY_API | The API key needed for connecting to Google Analytics (Optional, only required if needing to send analytics to Google Analytics) | N/A
ANALYTICS_TAG_KEY | The key needed to send analytics to Google Analytics (Optional, only required if needing to send analytics to Google Analytics) | N/A

All of these values can be found in either the Azure App Configurations for the SND environment, or the Azure Service Bus for the SND environment.


## Starting the application

Before starting the application, make sure to run 'npm install' from the root of the application to install all of the necessary dependencies.

### Running the application

Once all the dependencies have been installed, start up Docker and then run the command 'docker-compose up --build'. This will build the application using the .env variables specified, and then will run and host the application on the localhost port specified in the .env file.

Once the Docker application is running, the frontend application can be accessed by entering the localhost port in any web browser, followed by **/water/start**

e.g localhost:3600/water/start

In order to access the _/score_ page, the **ffc-grants-desirability-scoring** service must be running locally, and the DEFRA VPN connection must be active (this is required to send and receive requests via Azure Service Buses)

Please note: There is a page guard in effect in this service which will stop a user from jumping to a url out of logic. If the user needs to access a specific page (such as _/score_), they would need to navigate through the grant as normal.

### Stopping the application

In order to stop the frontendapplication, press **CTRL + C** in the docker terminal, and enter **Y** if prompted. If other services are running (such as _ffc-grants-desirability-scoring_), this would need to be repeated in their respective docker terminals.

### Running unit tests

To run unit tests in this application, run 'npm run test' in the terminal from the root of the application.

Please note: Some Mac users have not been able to run this in the terminal successfully. Instead, these users would run 'scripts/test', which also runs all of the unit tests. The only difference between using this command is that all of the tests are run via docker instead of node.

