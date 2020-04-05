import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/core/header/header.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private readonly headerService: HeaderService
  ) { }

  ngOnInit(): void {
    this.headerService.title = 'Terms and conditions of use, privacy policy and personal data protection';
  }

}
