export type TransactionType =
  | "INITIAL"
  | "CASH_IN"
  | "CASH_OUT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "BILIMZONE_TOP_UP"
  | "PAYMENT";

export type TransactionStatus = "SUCCESS" | "FAILED";

export interface BankCard {
  id: number;
  card_number: string;
  masked_number: string;
  card_holder: string;
  expiry_month: number;
  expiry_year: number;
  cvv: string;
  is_active: boolean;
  created_at: string;
}

export interface BankAccount {
  id: number;
  account_number: string;
  currency: "KGS";
  balance: string;
  is_active: boolean;
  created_at: string;
  card: BankCard;
}

export interface BankCustomer {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  external_bilimzone_user_id: string;
  is_active: boolean;
  created_at: string;
  accounts: BankAccount[];
}

export interface AuthResponse {
  token: string;
  customer: BankCustomer;
}

export interface BankTransaction {
  id: number;
  transaction_id: string;
  account: number;
  account_number: string;
  card_number: string;
  target_account: number | null;
  target_account_number: string | null;
  transaction_type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: "KGS";
  description: string;
  external_service: string;
  external_user_id: string;
  external_reference: string;
  created_at: string;
}

export interface OperationResponse {
  success?: boolean;
  message?: string;
  bilimzone_user_id?: string;
  amount?: string;
  currency?: "KGS";
  external_reference?: string;
  account?: BankAccount;
  from_account?: BankAccount;
  to_account?: BankAccount;
  transaction: BankTransaction;
}
