# MeldRx Template App - Blank (NextJs)

## Getting Started
Before launching the app ensure the following configuration steps have been followed:
- app redirect url
  - on https://app.meldrx.com
  - go to `Apps` -> your application
  - in the `Redirect URLs` section
  - add the redirect url `http://localhost:{port}/login-callback` with the same port as this application, by default it's `3000`
- workspace configuration
  - if the workspace is `standalone`
    - you will want to seed it with a patient that you can select to view in this app.
    - go to https://app.meldrx.com/ccda?sample=sample1
    - copy paste the ccda xml in to a new file such as `ccda.xml`
    - go to `Workspaces` -> your workspace -> `Patients` -> click on `Import Data`
    - select the `ccda.xml` file
  - if the workspace is `linked` (to Epic or Cerner etc...)
    - you will want to ignore MeldRx storage, and only use external.
    - go to `Workspaces` -> your workspace -> `Settings` -> `Data Rules`
    - in the `Bulk Updates` section, fill out the form to:
      - `Trigger Action`: `Read`
      - `Resource Type`: `Select All`
      - `Target`: `External`
      - press `Update Rules`


### Preqrequisites
- NodeJs

### App Setup/Installation
- Run `npm install`

### App Configuration
- Open `.env`
- Replace the `NEXT_PUBLIC_MELDRX_CLIENT_ID` with the Client Id (aka "MeldRx App Id") of your **MeldRx App** (Get this from the "My Apps" page)
- Replace the `NEXT_PUBLIC_MELDRX_WORKSPACE_URL` with the Workspace URL

### Run the App
- `npm run dev`

