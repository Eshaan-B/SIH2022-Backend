# SIH22-Backend

## Setup

- Add the following code snippet with proper values in `./config/default.json` for connecting to firestore:
  ```json
  {
    "apiKey": "",
    "authDomain": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": ""
  }
  ```
- `npm install` to install all dependencies.
- `npm start` to start the server, OR
- `npm run server` to start server using `nodemon`.

## Routes

### Testing

- GET - `/` - Return `"Hello World!"`

### User - `/api/users`

- POST - `/signup` - Register new user
- POST - `/login` - Login user and return JSONWebToken

### Tracker - `/api/trackers`

- GET - `/index` - Get all trackers
- GET - `/:id` - Get tracker by id
- PUT - `/update/:id` - Update tracker by id
- POST - `/new` - Create new tracker
- DELETE - `/delete/:id` - Delete tracker by id
