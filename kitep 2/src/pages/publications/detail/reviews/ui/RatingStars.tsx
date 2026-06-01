import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

type RatingStarsProps = {
    value: number;
    readonly?: boolean;
    size?: "sm" | "md" | "lg";
    onChange?: (value: number) => void;
};

const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
};

export const RatingStars = ({
    value,
    readonly = false,
    size = "md",
    onChange,
}: RatingStarsProps) => {
    const { t } = useTranslation();

    const roundedValue = Math.round(Number(value || 0));

    return (
        <div
            className="flex items-center gap-1"
            aria-label={t("publication.reviews.ratingLabel", {
                rating: value,
                defaultValue: "Оценка {{rating}} из 5",
            })}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= roundedValue;

                if (readonly) {
                    return (
                        <Star
                            key={star}
                            className={`${sizeClasses[size]} ${active
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300"
                                }`}
                        />
                    );
                }

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange?.(star)}
                        className="rounded-lg p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                        aria-label={t("publication.reviews.selectRating", {
                            rating: star,
                            defaultValue: "Выбрать оценку {{rating}}",
                        })}
                    >
                        <Star
                            className={`${sizeClasses[size]} ${active
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-300"
                                }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};