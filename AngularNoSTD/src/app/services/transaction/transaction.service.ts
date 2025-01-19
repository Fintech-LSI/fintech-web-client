import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

    private transactionCountSubject: BehaviorSubject<number>;
  transactionCount$ ;

  constructor() {
       const storedCount = localStorage.getItem('transactionCount');
       const initialCount = storedCount ? parseInt(storedCount, 10) : 0;
        this.transactionCountSubject = new BehaviorSubject<number>(initialCount);
       this.transactionCount$ = this.transactionCountSubject.asObservable();
  }

  incrementTransactionCount() {
    const newCount = this.transactionCountSubject.value + 1
     this.transactionCountSubject.next(newCount);
      localStorage.setItem('transactionCount', newCount.toString());
  }
    resetTransactionCount(){
      this.transactionCountSubject.next(0);
        localStorage.setItem('transactionCount', '0');
    }

}