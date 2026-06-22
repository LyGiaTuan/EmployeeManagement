A employee management application include: backend project, frontend project

backend project:
- structure:
 - src:
  - config: config which connect to library, database
  - controllers: response to client
  - enums: contain the value that is never change
  - filters: contains or middleware
  - routers: include route 
  - services: include service which handle logic of business
  - utils: the code is used common
  - index: the main file which start service
  - initData: the file init data of manager
- .env.example: evironment file example


 - how to start:
  - first, create .env in root project with fields (like .env.example):
  - TWILIO_ACCOUNT_SID:  account twilio account sid (get it from twilio)
  - TWILIO_AUTH_TOKEN:  account twilio account auth token (get it from twilio)
  - TWILIO_VERIFY_SERVICE_SID: service id which is created in twilio 
  - MANAGER_PHONE: manager's phone 
  - MANAGER_NAME: manager's name
  - MANAGER_EMAIL: manager's email
  - MANAGER_ADDRESS: manager's address
  - MANAGER_USERNAME: manager's username 
  - MANAGER_PASSWORD: manager's password
  - JWT_SECRET: secret to sign and verfiy jwt token
  - MAIL_USERNAME: email which is used to send mail to employee (in this case email must be gmail)
  - MAIL_PASSWORD: password which service can use to login email (app password)
  - FE_URL: frontend url
  - PASSWORD_SALT: the salt which password bcrypt use to hash password
 - second, put the google account service key to connect to firebase to root project, and rename it to firebaseKey.json
 - third, run npm i to install packages the project need
 - fourth, run npm run init to init data of manager
 - final, run npm start to start the service

frontend project:
- structure:
 - src:
  - assets: svgs used in project
  - components: the jsx components used in many places in project
  - contexts: the contexts provide data (createContext)
  - providers: the wrapper that provide data for whole project
  - screens: the jsx components which is page
   - components in screens: the jsx components use in screens
  - utils: the js code used in many place in project
 - .env.example: evironment file example

 - how to start:
  - first, create .env with the field (like .env.example):
   - REACT_APP_BE_URL: backend url
  - second, run npm i to install packages
  - final, run npm start