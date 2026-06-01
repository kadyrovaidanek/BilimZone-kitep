export type AdminPublicationReview = {
    id: number;
    publication_id: number;
    publication_title: string;
    user: number;
    username: string;
    rating: number;
    text: string;
    created_at: string;
    updated_at: string;
};

export type AdminReviewsResponse = {
    count: number;
    reviews: AdminPublicationReview[];
};