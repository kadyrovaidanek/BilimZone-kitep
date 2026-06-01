import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://bilimzone-backend1.onrender.com";

export type PlatformCommissionSetting = {
    id: number;
    title: string;
    commission_percent: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export const getActivePlatformCommission = () => {
    return axios.get<PlatformCommissionSetting>(
        `${API_BASE_URL}/api/platform-commission/active/`,
    );
};

export const updateActivePlatformCommission = (data: {
    commission_percent: string;
}) => {
    return axios.put<PlatformCommissionSetting>(
        `${API_BASE_URL}/api/platform-commission/active/`,
        data,
    );
};