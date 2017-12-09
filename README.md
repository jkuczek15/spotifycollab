# Web Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.0.

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

## Full Testing
We can test both the API and our development changes by doing the following: 

1. Navigate to project folder, run `npm install` to install any missing dependencies.
2. Make sure you have [mongoDB](https://www.mongodb.com/download-center#community) installed and it is running on port 27017.
2. Run `ng build` to build the project.
3. Run `npm start` to run the project.
4. Navigate  [http://localhost:3000/](http://localhost:3000/) in your browser.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Shorthand Angular Commands
- `ng build` -- `ng b`
- `ng serve` -- `ng s`
- `ng generate component` -- `ng g c`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).