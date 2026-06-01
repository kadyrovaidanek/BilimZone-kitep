import { memo } from "react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/shared/ui/FormInput";
import { StepWrapper } from "@/shared/ui/StepWrapper";
import { Button } from "@/shared/ui/Button";

import type { StepProps } from "../types";

type Step3VerificationProps = StepProps & {
  onResendCode: () => void;
  codeLoading: boolean;
};

export const Step3Verification = memo(
  ({
    data,
    errors,
    updateField,
    onResendCode,
    codeLoading,
  }: Step3VerificationProps) => {
    const { t } = useTranslation();

    return (
      <StepWrapper
        title={t("register_form.step3.title")}
        description={
          data.email
            ? t("register_form.step3.description", { email: data.email })
            : t("register_form.step3.description_empty")
        }
      >
        <FormInput
          label={t("register_form.step3.code")}
          name="verificationCode"
          maxLength={4}
          value={data.verificationCode}
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 4);
            updateField("verificationCode", onlyDigits);
          }}
          error={errors.verificationCode}
          autoFocus
          className="text-center tracking-widest text-lg border"
        />

        <div className="flex flex-col justify-center w-[15rem] gap-2 mt-4">
          <Button type="button" onClick={onResendCode} disabled={codeLoading}>
            {codeLoading
              ? "Отправка..."
              : t("register_form.step3.resend")}
          </Button>
        </div>
      </StepWrapper>
    );
  },
);