import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MainBarService {
  private titleSubject: Subject<string> = new Subject<string>();
  private title$: Observable<string>;

  constructor() {
    this.title$ = this.titleSubject.asObservable();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getTitle(): Observable<string> {
    return this.title$;
  }
}
