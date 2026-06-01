import { Image, ImageUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
} from "../../model/types";

type CoverPageSectionProps = {
    form: CreatePublicationFormState;
    errors: CreatePublicationErrors;
    onChange: <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => void;
    onCoverFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CoverPageSection = ({
    form,
    errors,
    onChange,
    onCoverFileChange,
}: CoverPageSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-2 text-xl font-black text-slate-900">
                {t("publicationCreate.sections.cover", "Обложка")}
            </h2>

            <p className="mb-5 text-sm text-slate-500">
                {t(
                    "publicationCreate.hints.coverChoice",
                    "Выберите, как будет выглядеть обложка материала в каталоге.",
                )}
            </p>

            <div className="grid gap-4 lg:grid-cols-2">
                <label className="cursor-pointer rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                    <div className="flex items-start gap-3">
                        <input
                            type="radio"
                            checked={form.cover_mode === "file_page"}
                            onChange={() => onChange("cover_mode", "file_page")}
                            className="mt-1"
                        />

                        <div className="w-full">
                            <div className="flex items-center gap-2 font-black text-slate-900">
                                <Image className="h-5 w-5 text-blue-600" />
                                {t(
                                    "publicationCreate.coverModes.filePage",
                                    "Выбрать страницу из файла",
                                )}
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                {t(
                                    "publicationCreate.hints.coverPage",
                                    "Укажите номер страницы, и она будет показана как обложка материала.",
                                )}
                            </p>

                            {form.cover_mode === "file_page" && (
                                <div className="mt-4 max-w-xs">
                                    <span className="mb-2 block text-sm font-bold text-slate-700">
                                        {t(
                                            "publicationCreate.fields.coverPageNumber",
                                            "Номер страницы",
                                        )}
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={form.cover_page_number}
                                        onChange={(event) =>
                                            onChange(
                                                "cover_page_number",
                                                event.target.value,
                                            )
                                        }
                                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />

                                    {errors.cover_page_number && (
                                        <p className="mt-2 text-sm font-semibold text-red-500">
                                            {errors.cover_page_number}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </label>

                <label className="cursor-pointer rounded-2xl border border-slate-200 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                    <div className="flex items-start gap-3">
                        <input
                            type="radio"
                            checked={form.cover_mode === "custom_image"}
                            onChange={() => onChange("cover_mode", "custom_image")}
                            className="mt-1"
                        />

                        <div className="w-full">
                            <div className="flex items-center gap-2 font-black text-slate-900">
                                <ImageUp className="h-5 w-5 text-blue-600" />
                                {t(
                                    "publicationCreate.coverModes.customImage",
                                    "Загрузить свою картинку",
                                )}
                            </div>

                            <p className="mt-2 text-sm text-slate-500">
                                {t(
                                    "publicationCreate.hints.coverUpload",
                                    "Вы можете загрузить готовую обложку в формате JPG, JPEG или PNG.",
                                )}
                            </p>

                            {form.cover_mode === "custom_image" && (
                                <div className="mt-4">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={onCoverFileChange}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-3 file:font-bold file:text-blue-700 hover:file:bg-blue-100"
                                    />

                                    <p className="mt-3 text-xs font-semibold text-slate-400">
                                        {form.cover
                                            ? form.cover.name
                                            : t(
                                                "publicationCreate.hints.cover",
                                                "Поддерживаются JPG, JPEG и PNG.",
                                            )}
                                    </p>

                                    {errors.cover && (
                                        <p className="mt-2 text-sm font-semibold text-red-500">
                                            {errors.cover}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </label>
            </div>
        </section>
    );
};