# Nutrisha 🌱

Your personal AI-powered nutritionist designed to make smart nutrition simple and accessible. Achieve your health goals with personalized dietary guidance powered by cutting-edge AI and your FHIR health information.

---

## ✨ Key Features

### 📅🍎 Generate Diet Plan 
- **Set Your Preferences**: Customize your diet by sharing your activity level, health goals, meal configuration, dietary preferences, restrictions, and food preferences.
![Preferences](/public/images/readme-images/preferences.png)

- **Generate Personalized Diet Plans**: Get custom meal plans based on your preferences and FHIR health profile.
![Diet](/public/images/readme-images/diet-plan.png)
 
### 🍜🔍 Analyze Meals from image
- **Take picture of food**: Upload meal photos for instant nutritional insights (calories, macros, and more).
![Load Image](/public/images/readme-images/image-load.png)

- **Get detailed analysis**: Nutrisha provides a total food analysis, including a nutritional breakdown, identified products, insulin recommendation, meal assessment, suggestions and warnings.  
![Image Analysis](/public/images/readme-images/image-analysis.png)

### ☀️🌙 Light and Dark modes
- **Light mode**
![Load Image](/public/images/readme-images/light-mode.png)

- **Dark mode**
![Load Image](/public/images/readme-images/dark-mode.png)
---

**Smart Nutrition Made Simple** — Let Nutrisha empower your journey to a healthier you! 💪  

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
- Node.js

### App Setup/Installation
- Run `npm install`

### App Configuration
- Open `.env`
- Replace the `NEXT_PUBLIC_MELDRX_CLIENT_ID` with the Client Id (aka "MeldRx App Id") of your **MeldRx App** (Get this from the "My Apps" page)
- Replace the `NEXT_PUBLIC_MELDRX_WORKSPACE_URL` with the Workspace URL

### Run the App
- `npm run dev`

