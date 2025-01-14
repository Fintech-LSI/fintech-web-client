export interface TransactionRequest {
  transactionType: string;
  walletId: number;
  targetWalletId?: number;
  amount: number;
  description: string;
  moneyMethod: string;
}

