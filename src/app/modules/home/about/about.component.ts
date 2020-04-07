import { Component, OnInit } from '@angular/core';

import { HeaderService } from '../../../core/header/header.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss']
})
export class AboutComponent implements OnInit {

  public links: any;

  constructor(
    private readonly headerService: HeaderService
  ) { }

  ngOnInit() {
    this.headerService.title = 'About';
    this.links = environment.links;
  }
}
