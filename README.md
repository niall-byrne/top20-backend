# TOP 20 Backend Code

User Listening Data Visualizations (powered by last.fm)

## Develop Branch (Stage)
- ![Top20 Automation](https://github.com/playcounts/top20-backend/workflows/Top20%20Automation/badge.svg?branch=develop)

[Stage Environment](https://top-20-stage-3ba4c.web.app/)

## Master Branch (Production)
- ![Top20 Automation](https://github.com/playcounts/top20-backend/workflows/Top20%20Automation/badge.svg?branch=master)

[Production Environment](https://top-20-prod-f358c.web.app/)

## Environment Variabes

1. LASTFM_KEY

- Set this value to a valid last.fm API key

1. PORT

- Set this value to a valid listening port for the express server

2. STATIC_SERVER_ENABLED

- Set this value to "1" to enable serving the react application from the backend server

3. STATIC_FILE_LOCATION

- Set this to a relative path from the "src" folder containing the client React build artifacts.

4. STATIC_FILE_INDEX

- Set this value to "index.html", the name of the default index document used by React.

4. SERVERLESS

- Set this value to "1" to enable exporting the server as a serverless application.
