import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SwUpdate } from '@angular/service-worker';
import * as firebase from 'firebase/app';

import { HeaderService } from './core/header/header.service';

/**
 * HiScore app main component
 *
 * @export
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  /**
   * Sidenav menu
   */
  @ViewChild('sidenav', {static: false}) sidenav: MatSidenav;

  constructor(
    public headerService: HeaderService,
    private readonly swUpdate: SwUpdate
  ) {
    const config = {
      apiKey: 'AIzaSyA6LvjdDaK_uRVThClMGi-AFJ2nxo_0OFs',
      authDomain: 'hi-score-app.firebaseapp.com',
      databaseURL: 'https://hi-score-app.firebaseio.com',
      projectId: 'hi-score-app',
      storageBucket: 'hi-score-app.appspot.com',
      messagingSenderId: '299295266645',
      appId: '1:299295266645:web:552dc53389e6bd48a201dc',
      measurementId: 'G-MY486HKPP2'
    };
    firebase.initializeApp(config);
  }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('A new version is available ! Do you want to refresh the app ?')) {
          window.location.reload();
        }
      });
    }

    this.headerService.toggleMenu.subscribe(() => this.sidenav.toggle());
  }
}

if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker('./app.worker', { type: 'module' });
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}
