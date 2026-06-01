import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  createAgreement,
  deleteAgreement,
  getAgreements,
  updateAgreement,
  type Agreement,
} from "@/shared/api/agreements";

import {
  buildAgreementFormData,
  initialAgreementForm,
  mapAgreementToForm,
  type AgreementFormState,
} from "./agreements/lib/agreementForm";
import { AdminAgreementsHeader } from "./agreements/ui/components/AdminAgreementsHeader";
import { AgreementForm } from "./agreements/ui/components/AgreementForm";
import { AgreementsList } from "./agreements/ui/components/AgreementsList";
import { PlatformCommissionCard } from "./agreements/ui/components/PlatformCommissionCard";

export const AdminAgreementsPage = () => {
  const { t } = useTranslation();

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);

  const [audienceFilter, setAudienceFilter] = useState("all_filter");
  const [contextFilter, setContextFilter] = useState("all_filter");
  const [activeFilter, setActiveFilter] = useState("all_filter");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] =
    useState<AgreementFormState>(initialAgreementForm);

  const loadAgreements = async () => {
    try {
      setLoading(true);

      const response = await getAgreements({
        audience: audienceFilter,
        context: contextFilter,
        is_active: activeFilter,
      });

      setAgreements(response.data);
    } catch (error) {
      console.log("AGREEMENTS LOAD ERROR:", error);
      alert(t("agreements.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgreements();
  }, [audienceFilter, contextFilter, activeFilter]);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialAgreementForm);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert(t("agreements.validation.titleRequired"));
      return;
    }

    if (!form.text.trim() && !form.file) {
      alert(t("agreements.validation.contentRequired"));
      return;
    }

    const formData = buildAgreementFormData(form);

    try {
      if (editingId) {
        await updateAgreement(editingId, formData);
        alert(t("agreements.messages.updated"));
      } else {
        await createAgreement(formData);
        alert(t("agreements.messages.created"));
      }

      resetForm();
      await loadAgreements();
    } catch (error) {
      console.log("AGREEMENT SAVE ERROR:", error);
      alert(t("agreements.messages.saveError"));
    }
  };

  const handleEdit = (agreement: Agreement) => {
    setEditingId(agreement.id);
    setForm(mapAgreementToForm(agreement));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const ok = confirm(t("agreements.messages.deleteConfirm"));

    if (!ok) return;

    try {
      await deleteAgreement(id);
      await loadAgreements();
    } catch (error) {
      console.log("AGREEMENT DELETE ERROR:", error);
      alert(t("agreements.messages.deleteError"));
    }
  };

  const handleToggleActive = async (agreement: Agreement) => {
    const formData = new FormData();
    formData.append("is_active", String(!agreement.is_active));

    try {
      await updateAgreement(agreement.id, formData);
      await loadAgreements();
    } catch (error) {
      console.log("AGREEMENT STATUS ERROR:", error);
      alert(t("agreements.messages.statusError"));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <AdminAgreementsHeader count={agreements.length} />
        <PlatformCommissionCard />

        <AgreementForm
          form={form}
          editingId={editingId}
          onChange={setForm}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        <AgreementsList
          agreements={agreements}
          loading={loading}
          audienceFilter={audienceFilter}
          contextFilter={contextFilter}
          activeFilter={activeFilter}
          onAudienceChange={setAudienceFilter}
          onContextChange={setContextFilter}
          onActiveChange={setActiveFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </div>
    </main>
  );
};

export default AdminAgreementsPage;