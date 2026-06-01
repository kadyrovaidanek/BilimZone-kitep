import { useTranslation } from "react-i18next";

import { AgreementBlock } from "@/shared/ui/AgreementBlock";

import type { UserRegistrationData } from "@/entities/user/model/types";

type Step7ContractProps = {
  data: UserRegistrationData;
  errors: Partial<Record<keyof UserRegistrationData, string>>;
  updateField: <K extends keyof UserRegistrationData>(
    field: K,
    value: UserRegistrationData[K],
  ) => void;
};

export const Step7Contract = ({
  data,
  errors,
  updateField,
}: Step7ContractProps) => {
  const { t } = useTranslation();

  const audience =
    data.userType === "author" || data.userType === "organization"
      ? data.userType
      : "reader";

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          {t("register_form.contract.default_title")}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {t("register_form.contract.description")}
        </p>
      </div>

      <AgreementBlock
        audience={audience}
        context="registration"
        checked={Boolean(data.contractAccepted)}
        onChange={(checked) => updateField("contractAccepted", checked)}
        error={errors.contractAccepted}
      />
    </div>
  );
};