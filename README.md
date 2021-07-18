# FFC Grants Frontend

Frontend microservice for web front end of the application. It contains simple grant questions journey to check where applicant is elibible for water grants or not. On submission of application data is pulled from Redis and submited to eligibility service.

Evaluation happen is two step:

- Common eligibility questions - unable to answer these questions correctly will make application eligible.
- Scoring questions - these are project spcefic questions which send to scoring service and return respose with score, which give possibility of application chances.

## Prerequisites

- Access to an instance of an
[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)(ASB).
- Docker
- Docker Compose

Optional:

- Kubernetes
- Helm

### Azure Service Bus

This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`!config.isProd`) environment before the Docker
container is started. When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the micro-service will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-grants-claim-service/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-grants-claim-service/templates/azure-identity-binding.yaml).

| Name                   | Description                                                                                |
| ----                   | -----------                                                                                |
| MESSAGE_QUEUE_HOST     | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net`                     |
| MESSAGE_QUEUE_PASSWORD | Azure Service Bus SAS policy key                                                           |
| MESSAGE_QUEUE_USER     | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey`                        |

## Environment variables

The following environment variables are required by the application container.
Values for development are set in the Docker Compose configuration. Default
values for production-like deployments are set in the Helm chart and may be
overridden by build and release pipelines.

| Name                           | Description                               | Required  | Default            | Valid                       | Notes                                                                             |
| ----                           | -----------                               | :-------: | -------            | -----                       | -----                                                                             |
| APPINSIGHTS_CLOUDROLE          | Role used for filtering metrics           | no        |                    |                             | Set to `ffc-grants-frontend` in docker compose files                               |
| APPINSIGHTS_INSTRUMENTATIONKEY | Key for application insight               | no        |                    |                             | App insights only enabled if key is present. Note: Silently fails for invalid key |
| CACHE_NAME                     | Cache name                                | no        | redisCache         |                             |                                                                                   |
| COOKIE_PASSWORD                | Redis cookie password                     | yes       |                    |                             |                                                                                   |
| NODE_ENV                       | Node environment                          | no        | development        | development,test,production |                                                                                   |
| PORT                           | Port number                               | no        | 3000               |                             |                                                                                   |
| REDIS_HOSTNAME                 | Redis host                                | no        | localhost          |                             |                                                                                   |
| REDIS_PORT                     | Redis port                                | no        | 6379               |                             |                                                                                   |
| SESSION_CACHE_TTL              | Redis session timeout                     | no        | 30                 |                             |                                                                                   |
| REDIS_PASSWORD                 | Redis password                            | no        | password           |                            |                                                                                   |
| REDIS_PARTITION                | Redis partion                             | no        | password           |                            |                                                                                   |
| GOOGLE_TAG_MANAGER_KEY         | client side google tag key                | no        | GTM1234            |                             |                                                                                   |
| GOOGLE_TAG_MANAGER_SERVER_KEY  | server side google analytic key           | no        | GA123456           |                             |                                                                                   |
| PROTECTIVE_MONITORING_URL      | protective monitoring url                 | no        | url                |                             |                                                                                   |
| START_PAGE_URL                 | start page url                            | no        | url                |                             |                                                                                   |
| COOKIE_TTL_IN_MILLIS           | cookie timeout                            | no        | 54000 (15 minutes) |                             |                                                                                   |
| AUTH_USERNAME                  | auth username                             | no        | username           |                             |                                                                                   |
| AUTH_PASSWORD_HASH             | auth password hash (bycrpt)               | no        | hash password      |                             |                                                                                   |
| LOGIN_REQUIRED                 | is login required                         | no        | true/false         |                             |                                                                                   |
| PROJECT_DETAILS_QUEUE_ADDRESS  | service queue address                     | no        |                    |                             |                                                                                   |
| CONTACT_DETAILS_QUEUE_ADDRESS  | service queue address                     | no        |                    |                             |                                                                                   |
| POLLING_INTERVAL               | polling interval to get score             | no        | 60                 |                             |                                                                                   |
| POLLING_RETRIES                | polling retries                           | no        | 10                 |                             |                                                                                   |
| BACKEND_POLLING_HOST           | polling host to retrieve score            | yes       | url                |                             |                                                                                   |

Running the integration tests locally requires access to ASB, this can be
achieved by setting the following environment variables:
`SERVICE_BUS_HOST`, `SERVICE_BUS_USER`, `SERVICE_BUS_PASSWORD`.
`PROJECT_DETAILS_QUEUE_ADDRESS`, `CONTACT_DETAILS_QUEUE_ADDRESS` must be set to a valid, developer specific queue that is
available on ASB e.g. `ffc-grants-fronend-<initials>` where `<initials>` are the
initials of the developer.

## Test structure

The tests have been structured into subfolders of ./test as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

## How to run tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```bash
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

### Running ZAP scan

A docker-compose exists for running a
[ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/).
Primarily this will be run during CI. It can also be run locally via the
[zap](./scripts/zap) script.

### Running accessibility tests

A docker-compose exists for running an
[AXE](https://www.npmjs.com/package/@axe-core/cli).
Primarily this will be run during CI. It can also be run locally via the
[AXE](./scripts/axe) script.

### Running acceptance tests

See [README](./test/acceptance/README.md).

## Running the application

The application is designed to run in containerised environments, using Docker
Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to
run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the
CSS files that were generated during the Docker build.  For the site to render
correctly locally `npm run build` must be run on the host system.

By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```bash
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to
other running services.

Link to other services:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.link.yaml up
```

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress
controller to be running on the cluster. For example, the NGINX Ingress
Controller may be installed via Helm.  

Alternatively, a local port may be forwarded to the pod:

```bash
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-grants deployment/ffc-grants-fronend 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service
can be accessed and tested in the same way as described in the
[Test the service](#test-the-service) section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe
configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
