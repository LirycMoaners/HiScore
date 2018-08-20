import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ks-root',
  templateUrl: './keep-score.component.html',
  styleUrls: ['./keep-score.component.scss']
})
export class KeepScoreComponent implements OnInit {
  ngOnInit(): void {
    window.oncontextmenu = function(e) {
      if (e.button === 2) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  }
}
