import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
interface PredictionResponse {
  loan_status: string;
  probability_of_approval: string;
  probability_of_denial: string;
}


@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = '/api/loans';
  private predictionUrl = 'http://127.0.0.1:5000/predict'

  constructor(private http: HttpClient) { }

  createLoan(loanRequest: LoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.apiUrl, loanRequest);
  }

  getLoanById(id: number): Observable<LoanResponse> {
    return this.http.get<LoanResponse>(`${this.apiUrl}/${id}`);
  }
  getLoansByUserId(userId: number): Observable<LoanResponse[]> {
    return this.http.get<LoanResponse[]>(`${this.apiUrl}/user/${userId}`);
  }
  getAllLoans(): Observable<LoanResponse[]> {
    return this.http.get<LoanResponse[]>(`${this.apiUrl}`);
  }
  updateLoanStatus(id: number, status: number, probaApproval: number, probaDenial: number): Observable<any> {
    let params = new HttpParams()
      .set('status', status.toString())
      .set('probaApproval', probaApproval.toString())
      .set('probaDenial', probaDenial.toString());
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, {}, {params});
  }
  predictLoan(loan: LoanResponse): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.predictionUrl, loan);
  }
}
