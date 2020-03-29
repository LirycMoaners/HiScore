import { Component, OnInit } from '@angular/core';

import { HeaderService } from '../../../core/header/header.service';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    private readonly headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.title = 'About';
  }
}
