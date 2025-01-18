import { Component } from '@angular/core';
import { LoanService } from '../../services/loan/loan.service';
import { UserService } from '../../services/user/user.service'; // Import UserService

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
    loanAmount: 0.00,
    loanInterestRate: 0.00,
    loanPercentIncome: 0.00,
    cbPersonDefaultOnFile: "Y",
    cbPersonCredHistLength: 0,
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

  userId: number | null = null; // Add userId property
  loading: boolean = false;
  error: string | null = null;


  constructor(private loanService: LoanService, private userService: UserService) { } // Inject UserService

  createLoan() {
    if(this.userId == null){
      this.showAlertMessage('User ID not available. Please login', 'error');
      return
    }
    this.loanRequest.userId = this.userId;
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
    if (this.userId == null){
      this.showAlertMessage('User ID not available. Please login', 'error');
      return
    }
    this.loanService.getLoansByUserId(this.userId).subscribe({
      next: (response) => {
        this.userLoans = response;
      },
      error: (err) =>{
        console.log("Error fetching loans for user ", this.userId);
        this.showAlertMessage('Error fetching loan!', 'error');
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
    this.validateAndLoadProfile();
    //this.fetchUserLoans(); // removed fetch here , since the profile loading takes time,
    // we have to get the user Id before the fetching user loans.

  }


  validateAndLoadProfile(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'No token found. Please log in.';
        return;
      }

      this.loading = true;
      this.userService.validateToken(token).subscribe({
        next: (response) => {
          const { user } = response; // Only get the user object
          this.userId = user.id; // Extract user ID and assign it
          this.loading = false;
          this.fetchUserLoans();
        },
        error: (err) => {
          this.error = 'Failed to validate token or load profile data.';
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      this.error = 'Local storage is not available.';
    }
  }

}
