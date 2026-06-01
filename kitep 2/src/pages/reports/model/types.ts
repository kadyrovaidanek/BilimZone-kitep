export type ReportRole = "admin" | "owner";

export type ExportFormat = "pdf" | "excel" | "docx";

export type ReportFilters = {
    date_from: string;
    date_to: string;
    category: string;
    owner: string;
    search: string;
};

export type ReportSummary = {
    total_sales: number;
    platform_income?: number;
    owners_income?: number;
    owner_income?: number;
    platform_commission?: number;
    purchases_count: number;
    top_material?: string | null;
};

export type SalesByDateItem = {
    date: string;
    total_sales: number;
    platform_income?: number;
    owners_income?: number;
    owner_income?: number;
    platform_commission?: number;
    purchases_count: number;
};

export type SalesByCategoryItem = {
    category: string;
    total_sales: number;
    platform_income: number;
    purchases_count: number;
};

export type SalesByPublicationItem = {
    publication_id: number;
    title: string;
    category?: string;
    owner?: string;
    total_sales: number;
    platform_income?: number;
    owners_income?: number;
    owner_income?: number;
    platform_commission?: number;
    purchases_count: number;
};

export type TopOwnerItem = {
    owner_id: number;
    owner: string;
    total_sales: number;
    platform_income: number;
    owner_income: number;
    purchases_count: number;
};

export type AdminReportData = {
    role: "admin";
    commission_percent: string;
    summary: ReportSummary;
    charts: {
        sales_by_date: SalesByDateItem[];
        sales_by_category: SalesByCategoryItem[];
    };
    tables: {
        top_publications: SalesByPublicationItem[];
        top_owners: TopOwnerItem[];
    };
};

export type OwnerReportData = {
    role: "owner";
    commission_percent: string;
    summary: ReportSummary;
    charts: {
        sales_by_date: SalesByDateItem[];
        sales_by_publication: SalesByPublicationItem[];
    };
    tables: {
        publications: SalesByPublicationItem[];
    };
};

export type ReportData = AdminReportData | OwnerReportData;