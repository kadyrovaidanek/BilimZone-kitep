import type {
  AuthResponse,
  BankAccount,
  BankCustomer,
  BankTransaction,
  OperationResponse,
} from "../types/bank";

const API_BASE_URL =
  import.meta.env.VITE_BANK_API_URL || "http://127.0.0.1:8001/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Bank API error");
  }

  return data as T;
}

export const bankApi = {
  getCustomers() {
    return request<BankCustomer[]>("/bank/customers/");
  },

  register(payload: {
    full_name: string;
    phone: string;
    email?: string;
    password: string;
    initial_balance?: string;
    external_bilimzone_user_id?: string;
  }) {
    return request<AuthResponse>("/bank/customers/register/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: { phone: string; password: string }) {
    return request<AuthResponse>("/bank/customers/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getCustomer(customerId: number) {
    return request<BankCustomer>(`/bank/customers/${customerId}/`);
  },

  getPendingCodes(customerId: number) {
    return request<{
      codes: Array<{
        code: string;
        card_number: string;
        masked_number: string;
        card_holder: string;
        customer_id: number;
        created_at: string;
      }>;
    }>(`/bank/customers/${customerId}/codes/`);
  },

  getAccountByCard(cardNumber: string) {
    return request<BankAccount>(`/bank/accounts/card/${cardNumber}/`);
  },

  getTransactions(cardNumber: string) {
    return request<BankTransaction[]>(
      `/bank/accounts/card/${cardNumber}/transactions/`
    );
  },

  cashIn(payload: { card_number: string; amount: string; description?: string }) {
    return request<OperationResponse>("/bank/cash-in/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  cashOut(payload: { card_number: string; amount: string; description?: string }) {
    return request<OperationResponse>("/bank/cash-out/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  transfer(payload: {
    from_card: string;
    to_card: string;
    amount: string;
    description?: string;
  }) {
    return request<OperationResponse>("/bank/transfer/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  topUpBilimZone(payload: {
    card_number: string;
    amount: string;
    bilimzone_user_id: string;
    description?: string;
  }) {
    return request<OperationResponse>("/bank/bilimzone/top-up/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  pay(payload: {
    card_number: string;
    amount: string;
    merchant?: string;
    external_reference?: string;
  }) {
    return request<OperationResponse>("/bank/pay/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};