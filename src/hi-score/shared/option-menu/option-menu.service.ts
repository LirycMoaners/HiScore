import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class OptionMenuService {
  private editLastRoundSubject: Subject<null> = new Subject<null>();
  private editLastRound$: Observable<null>;
  private newGameSubject: Subject<null> = new Subject<null>();
  private newGame$: Observable<null>;

  constructor() {
    this.editLastRound$ = this.editLastRoundSubject.asObservable();
    this.newGame$ = this.newGameSubject.asObservable();
  }

  public setEditLastRound(): void {
    this.editLastRoundSubject.next();
  }

  public getEditLastRound(): Observable<null> {
    return this.editLastRound$;
  }

  public setNewGame(): void {
    this.newGameSubject.next();
  }

  public getNewGame(): Observable<null> {
    return this.newGame$;
  }
}
