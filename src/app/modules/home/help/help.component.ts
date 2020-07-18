import { Component, OnInit } from '@angular/core';

import { HeaderService } from '../../../core/header/header.service';

@Component({
  selector: 'app-help',
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.scss']
})
export class HelpComponent implements OnInit {

  constructor(
    private readonly headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Help';
  }
}
