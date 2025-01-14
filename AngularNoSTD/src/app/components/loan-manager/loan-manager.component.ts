import { Component, OnInit } from '@angular/core';
import { LoanService } from '../../services/loan/loan.service';


interface LoanResponse {
  loan_id: number;
  person_age: number;
  person_income: number;
  person_home_ownership: string;
  person_emp_length: number;
  loan_intent: string;
  loan_grade: string;
  loan_amnt: number;
  loan_int_rate: number;
  loan_status: number | null;
  loan_percent_income: number;
  cb_person_default_on_file: string;
  cb_person_cred_hist_length: number;
  probability_of_approval: number | null;
  probability_of_denial: number | null;
}
interface PredictionResponse {
  loan_status: string;
  probability_of_approval: string;
  probability_of_denial: string;
}

@Component({
  selector: 'app-loan-manager',
  templateUrl: './loan-manager.component.html',
  styleUrls: ['./loan-manager.component.scss'],
  standalone: false
})
export class LoanManagerComponent implements OnInit {
  loans: LoanResponse[] = [];
  predictionResults: { [loanId: number]: PredictionResponse } = {};
  loading: boolean = false;

  constructor(private loanService: LoanService) { }

  ngOnInit(): void {
    this.fetchLoans();
  }

  fetchLoans() {
    this.loading = true;
    this.loanService.getAllLoans().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching loans:', error);
        this.loading = false;
      }
    });
  }

  predictLoan(loan: LoanResponse) {
    this.loading = true;
    this.loanService.predictLoan(loan).subscribe({
      next: (result) => {
        this.predictionResults[loan.loan_id] = result;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error predicting loan:', error);
        this.loading = false;
      }
    });
  }
}
