import { Star } from "lucide-react";

type AdminReviewRatingProps = {
    rating: number;
};

export const AdminReviewRating = ({ rating }: AdminReviewRatingProps) => {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= Number(rating || 0);

                return (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${active
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-slate-300"
                            }`}
                    />
                );
            })}
        </div>
    );
};