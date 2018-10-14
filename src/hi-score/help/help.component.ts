import { Component, OnInit } from '@angular/core';
import { MainBarService } from '../shared/main-bar/main-bar.service';

@Component({
  selector: 'hs-help',
  templateUrl: 'help.component.html',
  styleUrls: ['help.component.scss']
})

export class HelpComponent implements OnInit {
  constructor(
    private mainBarService: MainBarService
  ) { }

  ngOnInit() {
    this.mainBarService.title = 'Help';
  }
}
