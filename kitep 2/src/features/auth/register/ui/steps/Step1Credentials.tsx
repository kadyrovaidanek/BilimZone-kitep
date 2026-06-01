import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { FormInput } from "@/shared/ui/FormInput";
import { StepWrapper } from "@/shared/ui/StepWrapper";

import { getPasswordStrength } from "../../lib/passwordValidation";
import type { StepProps } from "../types";

type Step1CredentialsProps = StepProps & {
  confirmPassword_val: string;
  setConfirmPassword_val: (val: string) => void;
  weakPasswordAccepted?: boolean;
  setWeakPasswordAccepted?: (value: boolean) => void;
};

const getStrengthBarClass = (level: string) => {
  if (level === "strong") {
    return "w-full bg-green-500";
  }

  if (level === "medium") {
    return "w-2/3 bg-yellow-400";
  }

  if (level === "weak") {
    return "w-1/3 bg-red-500";
  }

  return "w-0 bg-slate-200";
};

const getStrengthTextClass = (level: string) => {
  if (level === "strong") {
    return "text-green-700";
  }

  if (level === "medium") {
    return "text-yellow-700";
  }

  if (level === "weak") {
    return "text-red-700";
  }

  return "text-slate-500";
};

export const Step1Credentials = memo(
  ({
    data,
    errors,
    updateField,
    confirmPassword_val,
    setConfirmPassword_val,
  }: Step1CredentialsProps) => {
    const { t } = useTranslation();

    const passwordStrength = useMemo(
      () => getPasswordStrength(data.password),
      [data.password],
    );

    const showPasswordBlock = Boolean(data.password.trim());

    const strengthTitle = showPasswordBlock
      ? t(`register_form.passwordStrength.${passwordStrength.level}`)
      : "";

    return (
      <StepWrapper
        title={t("register_form.step1.title")}
        description={t("register_form.step1.description")}
      >
        <FormInput
          label={t("register_form.step1.username")}
          name="username"
          value={data.username}
          onChange={(event) => updateField("username", event.target.value)}
          error={errors.username}
        />

        <div className="space-y-3">
          <FormInput
            label={t("register_form.step1.password")}
            name="password"
            type="password"
            value={data.password}
            onChange={(event) => updateField("password", event.target.value)}
            error={errors.password}
          />

          {showPasswordBlock && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-500 sm:text-sm">
                  {t("register_form.passwordStrength.label")}
                </span>

                <span
                  className={`text-xs font-black sm:text-sm ${getStrengthTextClass(
                    passwordStrength.level,
                  )}`}
                >
                  {strengthTitle}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-out ${getStrengthBarClass(
                    passwordStrength.level,
                  )}`}
                />
              </div>

              {!passwordStrength.hasMinLength && (
                <p className="mt-2 text-xs font-semibold text-red-600 sm:text-sm">
                  {t("register_form.passwordValidation.minLength")}
                </p>
              )}
            </div>
          )}
        </div>

        <FormInput
          label={t("register_form.step1.confirmPassword")}
          name="confirmPassword"
          type="password"
          value={confirmPassword_val}
          onChange={(event) => setConfirmPassword_val(event.target.value)}
          error={errors.confirmPassword}
        />
      </StepWrapper>
    );
  },
);

export default Step1Credentials;