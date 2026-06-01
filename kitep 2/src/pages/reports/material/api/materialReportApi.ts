import axios from "axios";

import { API_BASE_URL } from "@/shared/api/publications";
import type {
    MaterialReportData,
    MaterialReportFilters,
    MaterialReportRole,
} from "../model/types";

const buildQueryParams = (filters: MaterialReportFilters) => {
    const params = new URLSearchParams();

    if (filters.date_from) {
        params.append("date_from", filters.date_from);
    }

    if (filters.date_to) {
        params.append("date_to", filters.date_to);
    }

    if (filters.search) {
        params.append("search", filters.search);
    }

    return params.toString();
};

type GetMaterialReportParams = {
    role: MaterialReportRole;
    publicationId: number | string;
    userId?: number | string | null;
    filters: MaterialReportFilters;
};

export const getMaterialReport = ({
    role,
    publicationId,
    userId,
    filters,
}: GetMaterialReportParams) => {
    const query = buildQueryParams(filters);

    if (role === "admin") {
        return axios.get<MaterialReportData>(
            `${API_BASE_URL}/api/reports/admin/material/${publicationId}/analytics/${query ? `?${query}` : ""
            }`,
        );
    }

    return axios.get<MaterialReportData>(
        `${API_BASE_URL}/api/reports/owner/${userId}/material/${publicationId}/analytics/${query ? `?${query}` : ""
        }`,
    );
};