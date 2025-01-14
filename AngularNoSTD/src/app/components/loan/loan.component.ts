import { Component } from '@angular/core';
import { LoanService } from '../../services/loan/loan.service';

interface LoanRequest {
  userId: number;
  loanIntent: string;
  loanGrade: string;
  loanAmount: number;
  loanInterestRate: number;
  loanPercentIncome: number;
  cbPersonDefaultOnFile: string;
  cbPersonCredHistLength: number;
}

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
@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.scss'],
  standalone: false,
})
export class LoanComponent {
  loanRequest: LoanRequest = {
    userId: 1,
    loanIntent: "PERSONAL",
    loanGrade: "D",
    loanAmount: 35000.00,
    loanInterestRate: 16.02,
    loanPercentIncome: 0.59,
    cbPersonDefaultOnFile: "Y",
    cbPersonCredHistLength: 3,
  };
  loanId: number | null = null;
  loanStatus: number | null = null;
  probaApproval: number | null = null;
  probaDenial: number | null = null;
  loanResponse: LoanResponse | null = null;
  statusResponse : any = null;
  isUpdatingStatus = false;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';
  userLoans: LoanResponse[] = [];
  loanIntentOptions: string[] = ["PERSONAL", "EDUCATION", "MEDICAL", "DEBTCONSOLIDATION"];
  loanGradeOptions: string[] = ["A", "B", "C", "D", "E", "F", "G"];
  personHomeOwnershipOptions: string[] = ["RENT", "OWN", "MORTGAGE", "OTHER"];
  cbPersonDefaultOnFileOptions: string[] = ["Y", "N"];
  constructor(private loanService: LoanService) { }

  createLoan() {
    this.loanService.createLoan(this.loanRequest).subscribe({
      next: (response) => {
        this.loanResponse = response;
        console.log("Loan Created ",response)
        this.showAlertMessage('Loan created successfully!', 'success');
        this.fetchUserLoans();
      },
      error: (err) => {
        console.error('Error creating loan:', err);
        this.showAlertMessage('Error creating loan!', 'error');
        this.loanResponse = null;
      }
    });
  }
  fetchUserLoans() {
    this.loanService.getLoansByUserId(1).subscribe({
      next: (response) => {
        this.userLoans = response;
      },
      error: (err) =>{
        console.log("Error fetching loans for user 1");
      }
    });
  }


  updateLoanStatus() {
    if (this.loanId != null && this.loanStatus != null && this.probaApproval!= null && this.probaDenial != null) {
      this.isUpdatingStatus = true;
      this.loanService.updateLoanStatus(this.loanId, this.loanStatus, this.probaApproval, this.probaDenial).subscribe({
        next : (response) =>{
          this.statusResponse = response;
          this.isUpdatingStatus = false;
          console.log("Loan Status Updated Successfully")
        },
        error: (err) => {
          console.error('Error updating loan status:', err);
          this.isUpdatingStatus = false;
          this.statusResponse = null;
          this.showAlertMessage('Error updating loan status', 'error');
        }
      });
    }
  }
  showAlertMessage(message: string, type: 'success' | 'error' | 'info') {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
  ngOnInit(){
    this.fetchUserLoans();
  }
}
