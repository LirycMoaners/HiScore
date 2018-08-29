import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MainBarService {
  private titleSubject: Subject<string> = new Subject<string>();
  private title$: Observable<string>;
  private isLeftSideSubject: Subject<boolean> = new Subject<boolean>();
  private isLeftSide$: Observable<boolean>;

  constructor() {
    this.title$ = this.titleSubject.asObservable();
    this.isLeftSide$ = this.isLeftSideSubject.asObservable();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getTitle(): Observable<string> {
    return this.title$;
  }

  public setIsLeftSide(isLeftSide: boolean): void {
    this.isLeftSideSubject.next(isLeftSide);
  }

  public getIsLeftSide(): Observable<boolean> {
    return this.isLeftSide$;
  }
}