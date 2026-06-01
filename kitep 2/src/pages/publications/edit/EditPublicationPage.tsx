import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/user/model/useAuth";
import { getCategories, type Category } from "@/shared/api/categories";
import {
  editPublication,
  getPublicationById,
} from "@/shared/api/publications";
import { AgreementBlock } from "@/shared/ui/AgreementBlock";

import {
  initialEditPublicationForm,
  mapPublicationToEditForm,
  getExistingPublicationFiles,
  type CurrentUserLike,
  type EditPublicationErrors,
  type EditPublicationFormState,
  type ExistingPublicationFiles,
} from "./lib/editPublicationTypes";
import {
  allowedDocumentExtensions,
  allowedImageTypes,
  getCurrentUserId,
  getOfficePreviewText,
  hasAllowedExtension,
} from "./lib/editPublicationHelpers";
import { validateEditPublicationForm } from "./lib/editPublicationValidation";
import { buildEditPublicationFormData } from "./lib/buildEditPublicationFormData";

import { EditPublicationHeader } from "./ui/components/EditPublicationHeader";
import { EditMainInfoSection } from "./ui/components/EditMainInfoSection";
import { EditCatalogSection } from "./ui/components/EditCatalogSection";
import { EditPricingSection } from "./ui/components/EditPricingSection";
import { EditFilesSection } from "./ui/components/EditFilesSection";
import { EditPreviewPagesSection } from "./ui/components/EditPreviewPagesSection";
import { EditPublicationActions } from "./ui/components/EditPublicationActions";
import { EditPublicationPreview } from "./ui/components/EditPublicationPreview";

const emptyExistingFiles: ExistingPublicationFiles = {
  fileUrl: "",
  fileName: "",
  coverUrl: "",
  pdfFileUrl: "",
  previewFileUrl: "",
};

export const EditPublicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const typedUser = user as CurrentUserLike | null;
  const currentLang = i18n.language === "kg" ? "kg" : "ru";

  const [form, setForm] = useState<EditPublicationFormState>(
    initialEditPublicationForm,
  );
  const [errors, setErrors] = useState<EditPublicationErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingFiles, setExistingFiles] =
    useState<ExistingPublicationFiles>(emptyExistingFiles);

  const [filePreviewUrl, setFilePreviewUrl] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [officePreviewText, setOfficePreviewText] = useState("");

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => String(category.id) === form.category);
  }, [categories, form.category]);

  const selectedOptions = useMemo(() => {
    return selectedCategory?.options?.filter((item) => item.is_active) || [];
  }, [selectedCategory]);

  const hasExistingFile = Boolean(
    existingFiles.fileUrl ||
    existingFiles.pdfFileUrl ||
    existingFiles.previewFileUrl,
  );

  const visibleErrors = submitted ? errors : {};
  const isPaid = form.price_type === "paid";

  const updateField = <K extends keyof EditPublicationFormState>(
    field: K,
    value: EditPublicationFormState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const response = await getCategories({
        is_active: "true",
        search: "",
      });

      const activeCategories = response.data
        .filter((category) => category.is_active)
        .map((category) => ({
          ...category,
          directions:
            category.directions?.filter((direction) => direction.is_active) ||
            [],
          options: category.options?.filter((option) => option.is_active) || [],
        }));

      setCategories(activeCategories);
    } catch (error) {
      console.log("CATEGORIES LOAD ERROR:", error);
      alert(t("publication_edit.messages.categoriesError"));
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadPublication = async () => {
    if (!id) {
      return;
    }

    try {
      setLoadingPage(true);

      const response = await getPublicationById(id);
      const publication = response.data;

      setForm(mapPublicationToEditForm(publication));
      setExistingFiles(getExistingPublicationFiles(publication));
    } catch (error) {
      console.log("PUBLICATION LOAD ERROR:", error);
      alert(t("publication_edit.messages.loadError"));
      navigate("/publications");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadPublication();
  }, [id]);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }

      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [filePreviewUrl, coverPreviewUrl]);

  const validateForm = () => {
    const nextErrors = validateEditPublicationForm({
      form,
      selectedOptions,
      hasExistingFile,
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleDocumentFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setOfficePreviewText("");

    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl("");
    }

    if (!file) {
      updateField("file", null);
      return;
    }

    if (!hasAllowedExtension(file.name, allowedDocumentExtensions)) {
      event.target.value = "";
      updateField("file", null);
      setSubmitted(true);
      setErrors((prev) => ({
        ...prev,
        file: "publication_edit.errors.fileFormat",
      }));
      return;
    }

    updateField("file", file);
    setFilePreviewUrl(URL.createObjectURL(file));

    const lowerName = file.name.toLowerCase();

    if (
      lowerName.endsWith(".doc") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".ppt") ||
      lowerName.endsWith(".pptx")
    ) {
      const text = await getOfficePreviewText(file);
      setOfficePreviewText(text);
    }
  };

  const handleCoverFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
      setCoverPreviewUrl("");
    }

    if (!file) {
      updateField("cover", null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      event.target.value = "";
      updateField("cover", null);
      setSubmitted(true);
      setErrors((prev) => ({
        ...prev,
        cover: "publication_edit.errors.coverFormat",
      }));
      return;
    }

    updateField("cover", file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!typedUser) {
      alert(t("publication_edit.messages.notAuthorized"));
      navigate("/login");
      return;
    }

    if (!id) {
      alert(t("publication_edit.messages.idNotFound"));
      return;
    }

    if (!validateForm()) {
      return;
    }

    const authorUserId = getCurrentUserId(typedUser);

    if (!authorUserId) {
      alert(t("publication_edit.messages.userIdNotFound"));
      return;
    }

    const formData = buildEditPublicationFormData({
      form,
      authorUserId,
    });

    try {
      setSaving(true);

      await editPublication(id, formData);

      alert(t("publication_edit.messages.updated"));
      navigate("/publications");
    } catch (error: any) {
      console.log("EDIT PUBLICATION ERROR:", error);
      console.log("EDIT PUBLICATION RESPONSE:", error?.response?.data);

      const backendErrors = error?.response?.data;

      if (backendErrors && typeof backendErrors === "object") {
        const nextErrors: EditPublicationErrors = {};

        Object.keys(backendErrors).forEach((key) => {
          const value = backendErrors[key];
          const field = key as keyof EditPublicationFormState;

          if (Array.isArray(value)) {
            nextErrors[field] = value[0];
          } else if (typeof value === "string") {
            nextErrors[field] = value;
          }
        });

        setErrors(nextErrors);
        setSubmitted(true);

        alert(
          `${t("publication_edit.messages.updateError")}\n` +
          JSON.stringify(backendErrors, null, 2),
        );
      } else {
        alert(t("publication_edit.messages.networkError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const downloadSelectedFile = () => {
    if (!form.file || !filePreviewUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = filePreviewUrl;
    link.download = form.file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loadingPage) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          {t("publication_edit.messages.loading")}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <EditPublicationHeader onBack={() => navigate("/publications")} />

          <div className="space-y-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <EditMainInfoSection
              form={form}
              errors={visibleErrors}
              onChange={updateField}
            />

            <EditCatalogSection
              form={form}
              errors={visibleErrors}
              categories={categories}
              loadingCategories={loadingCategories}
              currentLang={currentLang}
              onChange={updateField}
            />

            <EditPricingSection
              form={form}
              errors={visibleErrors}
              onChange={updateField}
            />

            <EditFilesSection
              form={form}
              errors={visibleErrors}
              existingFiles={existingFiles}
              onDocumentChange={handleDocumentFile}
              onCoverChange={handleCoverFile}
            />

            <EditPreviewPagesSection
              form={form}
              errors={visibleErrors}
              onChange={updateField}
            />

            {isPaid && (
              <section className="border-t border-slate-100 pt-6">
                <AgreementBlock
                  audience={
                    typedUser?.role === "organization"
                      ? "organization"
                      : "author"
                  }
                  context="paid_material"
                  checked={form.agreement_accepted}
                  onChange={(checked) =>
                    updateField("agreement_accepted", checked)
                  }
                  error={visibleErrors.agreement_accepted}
                />
              </section>
            )}

            <EditPublicationActions
              saving={saving}
              onCancel={() => navigate("/publications")}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <EditPublicationPreview
          form={form}
          existingFiles={existingFiles}
          filePreviewUrl={filePreviewUrl}
          coverPreviewUrl={coverPreviewUrl}
          officePreviewText={officePreviewText}
          onDownload={downloadSelectedFile}
        />
      </div>
    </main>
  );
};

export default EditPublicationPage;