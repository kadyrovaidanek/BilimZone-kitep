import { useTranslation } from "react-i18next";

import { useCreatePublicationForm } from "../hooks/useCreatePublicationForm";

import { CreatePublicationAlerts } from "./components/CreatePublicationAlerts";
import { CreatePublicationSubmitBar } from "./components/CreatePublicationSubmitBar";
import { CreatePublicationSuccessModal } from "./components/CreatePublicationSuccessModal";
import { PublicationConflictWarning } from "./components/PublicationConflictWarning";
import { PublicationPreSubmitInfo } from "./components/PublicationPreSubmitInfo";
import { SpellcheckWarningBox } from "./components/SpellcheckWarningBox";

import { CatalogSection } from "./sections/CatalogSection";
import { CoverPageSection } from "./sections/CoverPageSection";
import { FilesSection } from "./sections/FilesSection";
import { MainInfoSection } from "./sections/MainInfoSection";
import { PreviewSettingsSection } from "./sections/PreviewSettingsSection";
import { PricingSection } from "./sections/PricingSection";

export const CreatePublicationForm = () => {
    const { t } = useTranslation();

    const {
        form,
        errors,
        categories,
        filePreviewUrl,
        isPreviewLoading,
        previewError,

        agreementAudience,

        isCategoriesLoading,
        isSubmitting,

        submitError,
        successModalMessage,

        handleChange,
        handleFileChange,
        handleSubmit,
        refreshTemporaryPreview,

        conflictWarning,
        spellcheckWarning,

        handleViewConflictPublication,
        handleContinueAfterConflict,
        handleCancelConflict,

        handleFixSpellcheck,
        handleKeepSpellcheck,
        handleCloseSuccessModal,
    } = useCreatePublicationForm();

    return (
        <main className="min-h-screen bg-slate-50 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <CreatePublicationSuccessModal
                message={successModalMessage}
                onClose={handleCloseSuccessModal}
            />

            <div className="mx-auto w-full max-w-6xl">
                <section className="mb-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-sm sm:mb-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-sm sm:tracking-[0.2em]">
                        BilimZone
                    </p>

                    <h1 className="mt-2 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                        {t("publicationCreate.page.title", "Добавление публикации")}
                    </h1>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 sm:text-base">
                        {t(
                            "publicationCreate.page.subtitle",
                            "Заполните данные публикации, загрузите файл, настройте цену, обложку и страницы предпросмотра. После отправки материал попадёт на проверку администратору.",
                        )}
                    </p>
                </section>

                <CreatePublicationAlerts
                    isCategoriesLoading={isCategoriesLoading}
                    submitError={submitError}
                    submitSuccess=""
                />

                {conflictWarning && (
                    <PublicationConflictWarning
                        warning={conflictWarning}
                        isSubmitting={isSubmitting}
                        onView={handleViewConflictPublication}
                        onContinue={handleContinueAfterConflict}
                        onCancel={handleCancelConflict}
                    />
                )}

                {spellcheckWarning && (
                    <SpellcheckWarningBox
                        warning={spellcheckWarning}
                        isSubmitting={isSubmitting}
                        onFix={handleFixSpellcheck}
                        onKeep={handleKeepSpellcheck}
                    />
                )}

                <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
                    <MainInfoSection
                        form={form}
                        errors={errors}
                        onChange={handleChange}
                    />

                    <CatalogSection
                        form={form}
                        errors={errors}
                        categories={categories}
                        onChange={handleChange}
                    />

                    <PricingSection
                        form={form}
                        errors={errors}
                        agreementAudience={agreementAudience}
                        onChange={handleChange}
                    />

                    <FilesSection
                        form={form}
                        errors={errors}
                        onFileChange={handleFileChange}
                    />

                    <CoverPageSection
                        form={form}
                        errors={errors}
                        onChange={handleChange}
                        onCoverFileChange={handleFileChange("cover")}
                    />

                    <PreviewSettingsSection
                        form={form}
                        errors={errors}
                        filePreviewUrl={filePreviewUrl}
                        isPreviewLoading={isPreviewLoading}
                        previewError={previewError}
                        onRefreshPreview={refreshTemporaryPreview}
                        onChange={handleChange}
                    />

                    <PublicationPreSubmitInfo
                        hasFile={Boolean(form.file)}
                        hasPdfPreview={Boolean(filePreviewUrl)}
                    />

                    <CreatePublicationSubmitBar isSubmitting={isSubmitting} />
                </form>
            </div>
        </main>
    );
};

export default CreatePublicationForm;