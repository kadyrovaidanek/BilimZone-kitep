import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";

import {
    checkPublicationSpelling,
    createPublicationRequest,
    createTemporaryPublicationPreview,
    getActiveCategories,
    type Category,
} from "../api/publicationCreateApi";

import { buildPublicationFormData } from "../lib/buildPublicationFormData";
import { getPublicationAudience } from "../lib/getPublicationAudience";
import {
    isAllowedDocumentFile,
    isAllowedImageFile,
    isPdfFile,
} from "../lib/fileValidation";
import { getUserId, getUserRole } from "../lib/userHelpers";
import type { SpellcheckWarning } from "../lib/textQualityCheck";

import { initialCreatePublicationForm } from "../model/initialForm";
import type {
    CreatePublicationErrors,
    CreatePublicationField,
    CreatePublicationFormState,
} from "../model/types";
import { validateCreatePublicationForm } from "../model/validation";

import type { PublicationConflictWarningData } from "../ui/components/PublicationConflictWarning";

export const useCreatePublicationForm = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [form, setForm] = useState<CreatePublicationFormState>(
        initialCreatePublicationForm,
    );
    const [errors, setErrors] = useState<CreatePublicationErrors>({});
    const [categories, setCategories] = useState<Category[]>([]);

    const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitError, setSubmitError] = useState("");
    const [successModalMessage, setSuccessModalMessage] = useState("");

    const [filePreviewUrl, setFilePreviewUrl] = useState("");
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState("");

    const [conflictWarning, setConflictWarning] =
        useState<PublicationConflictWarningData | null>(null);

    const [spellcheckWarning, setSpellcheckWarning] =
        useState<SpellcheckWarning | null>(null);

    const [spellcheckConfirmed, setSpellcheckConfirmed] = useState(false);

    const userId = useMemo(() => getUserId(user), [user]);
    const userRole = useMemo(() => getUserRole(user), [user]);

    const agreementAudience = useMemo(
        () => getPublicationAudience(userRole),
        [userRole],
    );

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsCategoriesLoading(true);

                const response = await getActiveCategories();
                setCategories(response.data);
            } catch (error) {
                console.log("CREATE PUBLICATION CATEGORIES ERROR:", error);

                setSubmitError(
                    t(
                        "publicationCreate.messages.categoriesError",
                        "Ошибка загрузки категорий",
                    ),
                );
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        loadCategories();
    }, [t]);

    useEffect(() => {
        return () => {
            if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(filePreviewUrl);
            }
        };
    }, [filePreviewUrl]);

    const clearMessages = () => {
        setSubmitError("");
        setConflictWarning(null);
    };

    const clearFilePreview = () => {
        if (filePreviewUrl && filePreviewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(filePreviewUrl);
        }

        setFilePreviewUrl("");
        setPreviewError("");
        setIsPreviewLoading(false);
    };

    const requestTemporaryPreview = async (
        selectedFile: File,
        previewStartPage: string,
        previewEndPage: string,
    ) => {
        try {
            setIsPreviewLoading(true);
            setPreviewError("");

            if (isPdfFile(selectedFile)) {
                clearFilePreview();
                setFilePreviewUrl(URL.createObjectURL(selectedFile));
                return;
            }

            const previewFormData = new FormData();
            previewFormData.append("file", selectedFile);
            previewFormData.append("preview_start_page", previewStartPage || "1");
            previewFormData.append("preview_end_page", previewEndPage || "3");

            const response = await createTemporaryPublicationPreview(previewFormData);

            if (response.data.preview_url) {
                clearFilePreview();
                setFilePreviewUrl(response.data.preview_url);
                return;
            }

            setPreviewError(
                response.data.message ||
                t(
                    "publicationCreate.preview.error",
                    "Не удалось подготовить предпросмотр файла.",
                ),
            );
        } catch (error: any) {
            console.log("TEMP PREVIEW ERROR:", error);

            setPreviewError(
                error?.response?.data?.message ||
                t(
                    "publicationCreate.preview.error",
                    "Не удалось подготовить предпросмотр файла.",
                ),
            );
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const refreshTemporaryPreview = async () => {
        if (!form.file) return;

        await requestTemporaryPreview(
            form.file,
            form.preview_start_page,
            form.preview_end_page,
        );
    };

    const handleChange = <K extends CreatePublicationField>(
        field: K,
        value: CreatePublicationFormState[K],
    ) => {
        setForm((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };

            if (field === "category") {
                next.direction = "";
                next.option = "";
            }

            if (field === "price_type" && value === "free") {
                next.price = "";
                next.agreement_accepted = false;
            }

            if (field === "cover_mode" && value === "file_page") {
                next.cover = null;
            }

            return next;
        });

        setErrors((prev) => {
            const next = { ...prev };
            delete next[field];
            return next;
        });

        clearMessages();

        if (field === "title" || field === "description") {
            setSpellcheckWarning(null);
            setSpellcheckConfirmed(false);
        }
    };

    const handleFileChange =
        (field: "file" | "cover") =>
            async (event: React.ChangeEvent<HTMLInputElement>) => {
                const selectedFile = event.target.files?.[0] || null;

                if (!selectedFile) {
                    handleChange(field, null);

                    if (field === "file") {
                        clearFilePreview();
                    }

                    return;
                }

                const isAllowed =
                    field === "file"
                        ? isAllowedDocumentFile(selectedFile)
                        : isAllowedImageFile(selectedFile);

                if (!isAllowed) {
                    event.target.value = "";

                    setErrors((prev) => ({
                        ...prev,
                        [field]:
                            field === "file"
                                ? t(
                                    "publicationCreate.errors.fileFormat",
                                    "Можно загрузить только PDF, DOC, DOCX, PPT или PPTX.",
                                )
                                : t(
                                    "publicationCreate.errors.coverFormat",
                                    "Обложка должна быть в формате JPG, JPEG или PNG.",
                                ),
                    }));

                    return;
                }

                handleChange(field, selectedFile);

                if (field === "cover") {
                    handleChange("cover_mode", "custom_image");
                }

                if (field === "file") {
                    await requestTemporaryPreview(
                        selectedFile,
                        form.preview_start_page,
                        form.preview_end_page,
                    );
                }
            };

    const resetForm = () => {
        setForm(initialCreatePublicationForm);
        setErrors({});
        setSubmitError("");
        setConflictWarning(null);
        setSpellcheckWarning(null);
        setSpellcheckConfirmed(false);
        clearFilePreview();
    };

    const submitPublication = async (
        forceSubmit = false,
        formOverride?: CreatePublicationFormState,
    ) => {
        const formData = buildPublicationFormData({
            form: formOverride || form,
            userId,
            forceSubmit,
        });

        try {
            setIsSubmitting(true);
            setSubmitError("");
            setConflictWarning(null);

            await createPublicationRequest(formData);

            resetForm();

            setSuccessModalMessage(
                t(
                    "publicationCreate.messages.sentToModeration",
                    "Публикация успешно отправлена на модерацию администратору",
                ),
            );

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error: any) {
            console.log("CREATE PUBLICATION ERROR:", error);
            console.log("BACKEND RESPONSE:", error?.response?.data);

            const status = error?.response?.status;
            const backendData = error?.response?.data;

            if (status === 409 && backendData) {
                setConflictWarning(backendData);
                setSubmitError("");
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            if (backendData && typeof backendData === "object") {
                const firstKey = Object.keys(backendData)[0];
                const firstValue = backendData[firstKey];

                if (Array.isArray(firstValue)) {
                    setSubmitError(firstValue[0]);
                    return;
                }

                if (typeof firstValue === "string") {
                    setSubmitError(firstValue);
                    return;
                }
            }

            setSubmitError(
                t(
                    "publicationCreate.messages.createError",
                    "Ошибка добавления публикации. Проверьте данные и попробуйте снова.",
                ),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError("");
        setConflictWarning(null);

        if (!userId) {
            setSubmitError(
                t(
                    "publicationCreate.messages.notAuthorized",
                    "Сначала войдите в аккаунт",
                ),
            );
            return;
        }

        if (!agreementAudience) {
            setSubmitError(
                t(
                    "publicationCreate.messages.noAccess",
                    "Публикации могут добавлять только авторы и организации",
                ),
            );
            return;
        }

        const validationErrors = validateCreatePublicationForm(form, t);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setSubmitError(
                t(
                    "publicationCreate.messages.fixErrors",
                    "Проверьте поля формы и исправьте ошибки",
                ),
            );
            return;
        }

        if (!spellcheckConfirmed) {
            try {
                const response = await checkPublicationSpelling({
                    title: form.title,
                    description: form.description,
                });

                const warning = response.data;

                if (warning.unknownWords.length > 0 || warning.hasCaseFix) {
                    setSpellcheckWarning(warning);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    return;
                }
            } catch (error) {
                console.log("SPELLCHECK API ERROR:", error);

                setSubmitError(
                    t(
                        "publicationCreate.messages.spellcheckError",
                        "Не удалось проверить текст. Попробуйте ещё раз.",
                    ),
                );

                return;
            }
        }

        await submitPublication(false);
    };

    const handleViewConflictPublication = () => {
        if (!conflictWarning?.redirect_url) return;

        window.open(conflictWarning.redirect_url, "_blank", "noopener,noreferrer");
    };

    const handleContinueAfterConflict = async () => {
        await submitPublication(true);
    };

    const handleCancelConflict = () => {
        setConflictWarning(null);
    };

    const handleFixSpellcheck = async () => {
        if (!spellcheckWarning) return;

        const fixedForm = {
            ...form,
            title: spellcheckWarning.fixedTitle,
            description: spellcheckWarning.fixedDescription,
        };

        setForm(fixedForm);
        setSpellcheckWarning(null);
        setSpellcheckConfirmed(true);

        await submitPublication(false, fixedForm);
    };

    const handleKeepSpellcheck = async () => {
        setSpellcheckWarning(null);
        setSpellcheckConfirmed(true);

        await submitPublication(false, form);
    };

    const handleCloseSuccessModal = () => {
        setSuccessModalMessage("");
    };

    return {
        form,
        errors,
        categories,
        filePreviewUrl,
        isPreviewLoading,
        previewError,

        userRole,
        agreementAudience,

        isCategoriesLoading,
        isSubmitting,

        submitError,
        successModalMessage,

        conflictWarning,
        spellcheckWarning,

        handleChange,
        handleFileChange,
        handleSubmit,
        refreshTemporaryPreview,

        handleViewConflictPublication,
        handleContinueAfterConflict,
        handleCancelConflict,

        handleFixSpellcheck,
        handleKeepSpellcheck,
        handleCloseSuccessModal,
    };
};