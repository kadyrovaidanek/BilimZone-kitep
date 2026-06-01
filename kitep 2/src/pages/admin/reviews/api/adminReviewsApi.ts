import axios from "axios";

import { API_BASE_URL } from "@/shared/api/publications";

import type { AdminReviewsResponse } from "../model/types";

export const getAdminReviews = () => {
    return axios.get<AdminReviewsResponse>(
        `${API_BASE_URL}/api/admin/reviews/`,
    );
};

export const deleteAdminReview = (reviewId: number | string) => {
    return axios.delete(
        `${API_BASE_URL}/api/admin/reviews/${reviewId}/delete/`,
    );
};