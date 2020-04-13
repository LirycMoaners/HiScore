import { Component, OnInit } from '@angular/core';

import { environment } from 'src/environments/environment';
import { HeaderService } from '../../../core/header/header.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  /**
   * The HiScore web app URL
   */
  public websiteURL: string;

  constructor(
    private readonly headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Terms and conditions of use, privacy policy and personal data protection';
    this.websiteURL = environment.links.hiScoreWeb;
  }
}
