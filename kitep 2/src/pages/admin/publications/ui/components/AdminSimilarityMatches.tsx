import {
    AlertTriangle,
    CheckCircle2,
    ExternalLink,
    FileWarning,
} from "lucide-react";

import type { PublicationSimilarityMatch } from "@/shared/api/publications";

type AdminSimilarityMatchesProps = {
    matches?: PublicationSimilarityMatch[];
};

const getMatchTypeLabel = (
    matchType: PublicationSimilarityMatch["match_type"],
) => {
    if (matchType === "duplicate_file") {
        return "Дубликат файла";
    }

    if (matchType === "duplicate_text") {
        return "Дубликат текста";
    }

    return "Похожий текст";
};

const getStatusLabel = (status?: string | null) => {
    if (status === "published") {
        return "Опубликован";
    }

    if (status === "pending") {
        return "На модерации";
    }

    if (status === "rejected") {
        return "Отклонён";
    }

    return status || "Неизвестно";
};

const getStatusClass = (status?: string | null) => {
    if (status === "published") {
        return "bg-red-100 text-red-700";
    }

    if (status === "pending") {
        return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-600";
};

export const AdminSimilarityMatches = ({
    matches = [],
}: AdminSimilarityMatchesProps) => {
    if (!matches.length) {
        return (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    Совпадений с опубликованными материалами и заявками на
                    модерации не найдено
                </div>
            </div>
        );
    }

    return (
        <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-4">
            <div className="mb-4 flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />

                <div>
                    <h3 className="font-black text-orange-950">
                        Найдены похожие материалы
                    </h3>

                    <p className="mt-1 text-sm text-orange-800">
                        Перед одобрением сравните публикацию с найденными
                        материалами.
                    </p>
                </div>
            </div>

            <div className="grid gap-3">
                {matches.map((match) => (
                    <div
                        key={match.id}
                        className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm"
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-700">
                                        <FileWarning className="h-3.5 w-3.5" />
                                        {getMatchTypeLabel(match.match_type)}
                                    </span>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                                            match.matched_status,
                                        )}`}
                                    >
                                        {getStatusLabel(match.matched_status)}
                                    </span>
                                </div>

                                <p className="mt-3 text-base font-black text-slate-900">
                                    {match.matched_publication_title}
                                </p>

                                {match.matched_publication_author && (
                                    <p className="mt-1 text-sm text-slate-500">
                                        Автор:{" "}
                                        {match.matched_publication_author}
                                    </p>
                                )}

                                {match.detail && (
                                    <p className="mt-2 text-sm text-slate-600">
                                        {match.detail}
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0 text-left sm:text-right">
                                <p className="text-2xl font-black text-orange-700">
                                    {match.similarity_percent}%
                                </p>

                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    схожесть
                                </p>

                                <a
                                    href={match.matched_publication_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-3 py-2 text-sm font-bold text-white hover:bg-orange-700"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Посмотреть
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};