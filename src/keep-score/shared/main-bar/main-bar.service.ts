import { Injectable, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MainBarService implements OnInit {
  private titleSubject: Subject<string> = new Subject<string>();
  private title$: Observable<string>;

  constructor() { }

  public ngOnInit(): void {
    this.title$ = this.titleSubject.asObservable();
  }

  public setTitle(title: string): void {
    this.titleSubject.next(title);
  }

  public getTitle(): Observable<string> {
    return this.title$;
  }
}
