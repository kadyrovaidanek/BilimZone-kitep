export type PublicationReview = {
    id: number;
    publication: number;
    user: number;
    username: string;
    rating: number;
    text: string;
    created_at: string;
    updated_at: string;
};

export type PublicationReviewsResponse = {
    average_rating: number;
    reviews_count: number;
    reviews: PublicationReview[];
};

export type CreatePublicationReviewPayload = {
    user: string | number;
    rating: number;
    text: string;
};