import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class OptionMenuService {
  private currentGameIdSubject: Subject<string> = new Subject<string>();
  private currentGameId$: Observable<string>;
  private editLastRoundSubject: Subject<null> = new Subject<null>();
  private editLastRound$: Observable<null>;

  constructor() {
    this.currentGameId$ = this.currentGameIdSubject.asObservable();
    this.editLastRound$ = this.editLastRoundSubject.asObservable();
  }

  public setCurrentGameId(currentGameId: string): void {
    this.currentGameIdSubject.next(currentGameId);
  }

  public getCurrentGameId(): Observable<string> {
    return this.currentGameId$;
  }

  public setEditLastRound(): void {
    this.editLastRoundSubject.next();
  }

  public getEditLastRound(): Observable<string> {
    return this.editLastRound$;
  }
}
