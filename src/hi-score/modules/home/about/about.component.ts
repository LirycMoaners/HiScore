import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../core/header/header.service';

@Component({
  selector: 'hs-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss']
})

export class AboutComponent implements OnInit {
  constructor(
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.title = 'About';
  }
}
