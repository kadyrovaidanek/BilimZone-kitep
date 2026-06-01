import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const ReviewsAuthNotice = () => {
    const { t } = useTranslation();

    return (
        <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                        <LogIn className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="text-base font-black text-slate-900 sm:text-lg">
                            {t(
                                "publication.reviews.auth.title",
                                "Войдите, чтобы оставить отзыв",
                            )}
                        </h3>

                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                            {t(
                                "publication.reviews.auth.description",
                                "Отзывы могут оставлять только авторизованные пользователи.",
                            )}
                        </p>
                    </div>
                </div>

                <Link
                    to="/login"
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:w-auto"
                >
                    {t("publication.reviews.auth.login", "Войти")}
                </Link>
            </div>
        </div>
    );
};