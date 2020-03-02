import { Component, OnInit } from '@angular/core';
import { HeaderService } from './core/header/header.service';
import { GameCategory } from './shared/models/game-category.model';
import { Goal } from './shared/models/goal.enum';
import { GameCategoryService } from './core/services/game-category.service';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

/**
 * HiScore app main component
 *
 * @export
 */
@Component({
  selector: 'app-root',
  templateUrl: './hi-score.component.html',
  styleUrls: ['./hi-score.component.scss']
})
export class HiScoreComponent implements OnInit {

  private noGameCategory: GameCategory = {
    id: 'no-category',
    name: 'A Game',
    goal: Goal.highestScore,
    endingNumber: null,
    endingType: null
  };

  constructor(
    public headerService: HeaderService,
    private readonly gameCategoryService: GameCategoryService,
    private readonly swUpdate: SwUpdate
  ) {}

  ngOnInit(): void {
    this.gameCategoryService.getGameCategoryById(this.noGameCategory.id).pipe(
      flatMap(gameCategory => !gameCategory ? this.gameCategoryService.createGameCategory(this.noGameCategory) : of(null))
    ).subscribe();

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        if (confirm('A new version is available ! Do you want to refresh the app ?')) {
          window.location.reload();
        }
      });
    }
  }
}
