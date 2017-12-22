# Spotify Collab

Node.js, Express, Angular 4, Swagger, Socket.io

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.0.

# Installing Software

1. Install Node.js and npm from [here](https://nodejs.org/en/download/).
2. Run `npm install` inside the project directory to install missing dependencies.
3. Run the following three commands:

    `npm install -g nodemon`

    `npm install -g swagger`

    `npm install -g angular-cli`

4. Install [MongoDB](https://www.mongodb.com/download-center#community) for a database server. It is recommended that you add the MongoDB `bin` folder to your PATH environment variable. 
5. That's it, if you've made it this far, you're ready to run the project.

# Run the project
1. Navigate to the folder titled 'rest-api' and run the command `swagger project start`, this starts the rest-api which we will interact with both from the client and the server.
2. Run a mongodb database server. On Linux, open a new terminal and type `mongod`. On Windows, the executable file is something similar to the following path:  `./Program Files/MongoDB/Server/{version}/bin/mongod`
3. Navigate to the project directory and run `ng build --watch`. This watches the client side for changes.
4. Navigate to the project directory and run `nodemon`, this starts the web server along with socket.io on two separate ports. This also watches the server for changes.

## Rest API

Navigate to 'rest-api' folder and run `swagger project edit`, this allows us to edit and test our rest-api using swagger's slick interface.

##  Environments
To setup environment variables that are specific to the project, navigate to the folder `environments` under the main project directory. Some variables you can change here include: host, ports, and spotify web api configuration. 

## Development server

Run `ng serve` to serve the live development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

We can use the development server for testing any live `CSS/HTML` changes. Only do a full build when testing the `API` and `mongoDB` connections.

Note the development server runs on port `4200` while the full build runs on port `3000`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Production and Development Environments

The `-prod` flag can be added to both the `ng build` and `ng serve` commands. In components, this will set the global variable `environment.production` to true. Note that in production, Angular minifys JS and CSS files so the project runs a lot smoother.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Shorthand Angular Commands
- `ng build` -- `ng b`
- `ng serve` -- `ng s`
- `ng generate component` -- `ng g c`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).