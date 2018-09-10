import { Component, Inject } from '@angular/core';
import { EndingType } from '../../shared/game-category/ending-type.enum';
import { Goal } from '../../shared/game-category/goal.enum';
import { GameCategory } from '../../shared/game-category/game-category.model';
import { GameCategoryService } from '../../shared/game-category/game-category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UUID } from 'angular2-uuid';

/**
 * Component made for adding a new category
 *
 * @export
 * @class AddCategoryDialogComponent
 */
@Component({
  selector: 'hs-add-category-dialog',
  templateUrl: 'add-category-dialog.component.html',
  styleUrls: ['add-category-dialog.component.scss']
})
export class AddCategoryDialogComponent {
  /**
   * Ending type enum for HTML
   *
   * @type {typeof EndingType}
   * @memberof AddCategoryDialogComponent
   */
  public EndingType: typeof EndingType = EndingType;

  /**
   * Goal enum for HTML
   *
   * @type {typeof Goal}
   * @memberof AddCategoryDialogComponent
   */
  public Goal: typeof Goal = Goal;

  /**
   * The new category
   *
   * @type {GameCategory}
   * @memberof AddCategoryDialogComponent
   */
  public newGameCategory: GameCategory = new GameCategory();

  constructor(
    private gameCategoryService: GameCategoryService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public score: number
  ) { }

  /**
   * Add the new category in the database and close the dialog
   *
   * @memberof AddCategoryDialogComponent
   */
  public createGameCategory() {
    if (this.newGameCategory.name && this.newGameCategory.endingType && this.newGameCategory.endingNumber && this.newGameCategory.goal) {
      this.newGameCategory.id = UUID.UUID();
      this.gameCategoryService.createGameCategory(this.newGameCategory)
        .subscribe(() => this.dialogRef.close(this.newGameCategory));
    }
  }
}
