import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EndingType } from '../../shared/game-category/ending-type.enum';
import { Goal } from '../../shared/game-category/goal.enum';
import { GameCategory } from '../../shared/game-category/game-category.model';
import { GameCategoryService } from '../../shared/game-category/game-category.service';

@Component({
  selector: 'ks-add-category-popup',
  templateUrl: 'add-category-popup.component.html',
  styleUrls: ['add-category-popup.component.scss']
})

export class AddCategoryPopupComponent implements OnInit {
  @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() onValidate: EventEmitter<GameCategory> = new EventEmitter<GameCategory>();
  public EndingType: typeof EndingType = EndingType;
  public Goal: typeof Goal = Goal;

  public newGameCategory: GameCategory = new GameCategory();

  constructor(
    private gameCategoryService: GameCategoryService
  ) { }

  ngOnInit() { }

  public createGameCategory() {
    if (this.newGameCategory.name && this.newGameCategory.endingType && this.newGameCategory.endingNumber && this.newGameCategory.goal) {
      this.gameCategoryService.createGameCategory(this.newGameCategory)
        .subscribe((gameCategory: GameCategory) => this.onValidate.emit(gameCategory));
    }
  }

  public cancel(): void {
    this.onCancel.emit();
  }
}
