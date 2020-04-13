// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyA6LvjdDaK_uRVThClMGi-AFJ2nxo_0OFs',
    authDomain: 'hi-score-app.firebaseapp.com',
    databaseURL: 'https://hi-score-app.firebaseio.com',
    projectId: 'hi-score-app',
    storageBucket: 'hi-score-app.appspot.com',
    messagingSenderId: '299295266645',
    appId: '1:299295266645:web:552dc53389e6bd48a201dc',
    measurementId: 'G-MY486HKPP2'
  },
  links: {
    googlePlay: 'https://play.google.com/store/apps/details?id=com.cyrillefebvre.hiscore',
    hiScoreWeb: 'https://hi-score-app.web.app/',
    linkedIn: 'https://www.linkedin.com/in/cyril-lefebvre-2a818294/',
    github: 'https://github.com/LirycMoaners'
  }
};
