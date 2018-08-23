import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MainBarService {
  private titleSubject: Subject<string> = new Subject<string>();
  private title$: Observable<string>;
  private isBarVisibleSubject: Subject<boolean> = new Subject<boolean>();
  private isBarVisible$: Observable<boolean>;

  constructor() {
    this.title$ = this.titleSubject.asObservable();
    this.isBarVisible$ = this.isBarVisibleSubject.asObservable();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getTitle(): Observable<string> {
    return this.title$;
  }

  public setIsBarVisible(isBarVisible: boolean): void {
    this.isBarVisibleSubject.next(isBarVisible);
  }

  public getIsBarVisible(): Observable<boolean> {
    return this.isBarVisible$;
  }
}
