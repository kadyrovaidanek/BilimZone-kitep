import axios from "axios";

import { API_BASE_URL } from "@/shared/api/publications";

import type {
    CreatePublicationReviewPayload,
    PublicationReview,
    PublicationReviewsResponse,
} from "../model/types";

export const getPublicationReviews = (publicationId: number | string) => {
    return axios.get<PublicationReviewsResponse>(
        `${API_BASE_URL}/api/publications/${publicationId}/reviews/`,
    );
};

export const createPublicationReview = (
    publicationId: number | string,
    data: CreatePublicationReviewPayload,
) => {
    return axios.post<PublicationReview>(
        `${API_BASE_URL}/api/publications/${publicationId}/reviews/`,
        data,
    );
};