import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';

@Component({
  selector: 'hs-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss']
})

export class AboutComponent implements OnInit {
  constructor(
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.title = 'About';
  }
}
