import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<any>();
    event$ = this.eventSubject.asObservable();
    emit(event: any) {
      this.eventSubject.next(event);
   }
}