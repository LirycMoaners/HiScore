import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class OptionMenuService {
  private currentGameIdSubject: Subject<string> = new Subject<string>();
  private currentGameId$: Observable<string>;

  constructor() {
    this.currentGameId$ = this.currentGameIdSubject.asObservable();
  }

  public setCurrentGameId(currentGameId: string): void {
    this.currentGameIdSubject.next(currentGameId);
  }

  public getCurrentGameId(): Observable<string> {
    return this.currentGameId$;
  }
}
