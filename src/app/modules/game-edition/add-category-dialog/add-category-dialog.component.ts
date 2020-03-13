import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UUID } from 'angular2-uuid';
import { Component, Inject } from '@angular/core';
import { EndingType } from '../../../shared/models/ending-type.enum';
import { Goal } from '../../../shared/models/goal.enum';
import { GameCategory } from '../../../shared/models/game-category.model';
import { GameCategoryService } from '../../../core/services/game-category.service';

/**
 * Component made for adding a new category
 *
 * @export
 */
@Component({
  selector: 'app-add-category-dialog',
  templateUrl: 'add-category-dialog.component.html',
  styleUrls: ['add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  /**
   * Ending type enum for HTML
   */
  public EndingType: typeof EndingType = EndingType;

  /**
   * Goal enum for HTML
   */
  public Goal: typeof Goal = Goal;

  /**
   * The new category
   */
  public newGameCategory: GameCategory = new GameCategory();

  constructor(
    private gameCategoryService: GameCategoryService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  /**
   * Add the new category in the database and close the dialog
   */
  public createGameCategory() {
    if (this.newGameCategory.name && this.newGameCategory.endingType && this.newGameCategory.endingNumber && this.newGameCategory.goal) {
      this.newGameCategory.id = UUID.UUID();
      this.gameCategoryService.createGameCategory(this.newGameCategory)
        .subscribe(_ => this.dialogRef.close(this.newGameCategory));
    }
  }
}
