import { Component, OnInit } from '@angular/core';
import { HeaderService } from './core/header/header.service';
import { GameCategory } from './shared/models/game-category.model';
import { Goal } from './shared/models/goal.enum';
import { GameCategoryService } from './core/services/game-category.service';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

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

  private noGameCategory: GameCategory = {
    id: 'no-category',
    name: 'A Game',
    goal: Goal.highestScore,
    endingNumber: null,
    endingType: null
  };

  constructor(
    public headerService: HeaderService,
    private readonly gameCategoryService: GameCategoryService
  ) {}

  ngOnInit(): void {
    this.gameCategoryService.getGameCategoryById(this.noGameCategory.id).pipe(
      flatMap(gameCategory => !gameCategory ? this.gameCategoryService.createGameCategory(this.noGameCategory) : of(null))
    ).subscribe();
  }
}
