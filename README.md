# HiScore

This project is an Angular 5 version of the HiScore app (Nolan Lawson).


It was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.0.

It includes build for Android with [Cordova](https://github.com/apache/cordova-android) version 8.0.0.

It includes build for Desktop with [Electron](https://github.com/electron/electron) version 2.0.7.

## Dependencies

Run `npm install` to install all the dependencies this project needs.

Run `cordova platform add android` to install the platform to build for android.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `www\` directory.

Run `npm run build:android` to build the project for Android. It will launch directly on the smartphone linked to your computer. Dont forget to install the android platform.

Run `npm run build:desktop` to build the project for Desktop. It will launch directly in a window.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Running linter

Run `npm run lint` to execute the linter from angular-cli on your code.

## Packaging

Run `npm run build:prod` to build the project for production (with aot improvement). The build artifacts will be stored in the `www\` directory.

Run `npm run build:prod:android` to package the project for Android. The apk will be stored in `platforms\android\app\build\outputs\apk\debug\` directory. Dont forget to install the android platform.

Run `npm run build:prod:windows` to package the project for Windows. The exe will be stored in `hi-score-win32-x64\` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

To get more help on the Cordova use `cordova help` or go check out the [Cordova README](https://github.com/apache/cordova-cli/blob/master/README.md).

To get more help on the Electron go check out the [Electron README](https://github.com/electron/electron/blob/master/README.md).
