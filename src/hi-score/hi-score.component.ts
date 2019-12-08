import { Component, OnInit } from '@angular/core';
import { HeaderService } from './core/header/header.service';

/**
 * HiScore app main component
 *
 * @export
 * @class HiScoreComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'hs-root',
  templateUrl: './hi-score.component.html',
  styleUrls: ['./hi-score.component.scss']
})
export class HiScoreComponent implements OnInit {
  constructor(
    public headerService: HeaderService
  ) {}

  ngOnInit(): void {
  }
}
