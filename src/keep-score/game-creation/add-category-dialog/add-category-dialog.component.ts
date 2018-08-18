import { Component, Inject } from '@angular/core';
import { EndingType } from '../../shared/game-category/ending-type.enum';
import { Goal } from '../../shared/game-category/goal.enum';
import { GameCategory } from '../../shared/game-category/game-category.model';
import { GameCategoryService } from '../../shared/game-category/game-category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'ks-add-category-dialog',
  templateUrl: 'add-category-dialog.component.html',
  styleUrls: ['add-category-dialog.component.scss']
})

export class AddCategoryDialogComponent {
  public EndingType: typeof EndingType = EndingType;
  public Goal: typeof Goal = Goal;

  public newGameCategory: GameCategory = new GameCategory();

  constructor(
    private gameCategoryService: GameCategoryService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  public createGameCategory() {
    if (this.newGameCategory.name && this.newGameCategory.endingType && this.newGameCategory.endingNumber && this.newGameCategory.goal) {
      this.gameCategoryService.createGameCategory(this.newGameCategory)
        .subscribe((gameCategory: GameCategory) => this.dialogRef.close(gameCategory));
    }
  }
}
