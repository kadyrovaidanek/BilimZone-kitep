export type MaterialReportRole = "admin" | "owner";

export type MaterialReportFilters = {
    date_from: string;
    date_to: string;
    search: string;
};

export type MaterialReportPublication = {
    id: number;
    title: string;
    price: number;
    price_type: "free" | "paid" | string;
    category: string;
    author_user: number;
    author_username: string;
};

export type MaterialReportSummary = {
    total_sales: number;
    owner_income: number;
    platform_income: number;
    purchases_count: number;
    first_purchase_at: string | null;
    last_purchase_at: string | null;
};

export type MaterialSalesByDateItem = {
    date: string;
    total_sales: number;
    owner_income: number;
    platform_income: number;
    purchases_count: number;
};

export type MaterialPurchaseHistoryItem = {
    id: number;
    buyer_id: number;
    buyer_username: string;
    created_at: string;
    amount: number;
    owner_income: number;
    platform_income?: number;
};

export type MaterialReportData = {
    role: MaterialReportRole;
    publication: MaterialReportPublication;
    summary: MaterialReportSummary;
    charts: {
        sales_by_date: MaterialSalesByDateItem[];
    };
    purchases: MaterialPurchaseHistoryItem[];
};