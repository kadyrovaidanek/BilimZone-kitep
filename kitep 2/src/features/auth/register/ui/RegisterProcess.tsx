import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { INITIAL_REGISTRATION_DATA } from "@/entities/user/model/constants";
import type { UserRegistrationData } from "@/entities/user/model/types";
import { useUserStore } from "@/entities/user/model/user-store";
import { checkEmail, checkUsername } from "@/shared/api/auth";
import { RegisterForm } from "@/widgets/RegisterForm/ui/RegisterForm";

import { useRegister } from "../model/useRegister";

import {
  authorStep,
  baseSteps,
  contractStep,
  organizationStep,
  readerStep,
} from "../model/steps";

import { Step1Credentials } from "./steps/Step1Credentials";
import { Step2PersonalInfo } from "./steps/Step2PersonalInfo";
import { Step3Verification } from "./steps/Step3Verification";
import { Step5UserType } from "./steps/Step5UserType";
import { Step6Details } from "./steps/Step6Details";
import { Step7Contract } from "./steps/Step7Contract";

type ErrorMap = Partial<
  Record<keyof UserRegistrationData | "confirmPassword", string>
>;

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

const getInitialState = () => ({
  data: INITIAL_REGISTRATION_DATA,
  currentStep: 0,
  confirmPassword: "",
});

export const RegisterProcess = () => {
  const { t } = useTranslation();
  const [initialState] = useState(getInitialState);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [data, setData] = useState<UserRegistrationData>(initialState.data);

  const [confirmPassword, setConfirmPassword] = useState(
    initialState.confirmPassword,
  );

  const [weakPasswordAccepted, setWeakPasswordAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(initialState.currentStep);

  const [errors, setErrors] = useState<ErrorMap>({});
  const [liveErrors, setLiveErrors] = useState<ErrorMap>({});

  const { isAuthenticated, isLoading } = useUserStore();

  const {
    completeRegistration,
    sendVerificationCode,
    verifyRegistrationCode,
    loading,
    codeLoading,
  } = useRegister();

  const updateField = useCallback(
    <K extends keyof UserRegistrationData>(
      field: K,
      value: UserRegistrationData[K],
    ) => {
      setData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "password") {
        setWeakPasswordAccepted(false);
      }

      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });

      setLiveErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const username = data.username.trim();

    if (!username) {
      setLiveErrors((prev) => {
        const next = { ...prev };
        delete next.username;
        return next;
      });

      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const res = await checkUsername(username);

        setLiveErrors((prev) => {
          const next = { ...prev };

          if (res.data.exists) {
            next.username = t("register_form.errors.username_exists");
          } else {
            delete next.username;
          }

          return next;
        });
      } catch (error) {
        console.log("USERNAME CHECK ERROR:", error);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [data.username, t]);

  useEffect(() => {
    const email = data.email.trim();

    if (!email) {
      setLiveErrors((prev) => {
        const next = { ...prev };
        delete next.email;
        return next;
      });

      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const res = await checkEmail(email);

        setLiveErrors((prev) => {
          const next = { ...prev };

          if (res.data.exists) {
            next.email = t("register_form.errors.email_exists");
          } else {
            delete next.email;
          }

          return next;
        });
      } catch (error) {
        console.log("EMAIL CHECK ERROR:", error);
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [data.email, t]);

  const rawSteps = useMemo(() => {
    if (data.userType === "reader") {
      return [...baseSteps, readerStep, contractStep];
    }

    if (data.userType === "author") {
      return [...baseSteps, authorStep, contractStep];
    }

    if (data.userType === "organization") {
      return [...baseSteps, organizationStep, contractStep];
    }

    return [...baseSteps, readerStep, contractStep];
  }, [data.userType]);

  const steps = useMemo(() => {
    const titles = [
      t("register_form.steps.credentials"),
      t("register_form.steps.email"),
      t("register_form.steps.verification"),
      t("register_form.steps.user_type"),
      t("register_form.steps.details"),
      t("register_form.steps.contract"),
    ];

    return rawSteps.map((step, index) => ({
      ...step,
      title: titles[index] || step.title,
    }));
  }, [rawSteps, t]);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
      setIsSubmitted(false);
    }
  };

  const handleFileChange = useCallback(
    (field: "photo") => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;

      if (!file) {
        updateField(field, null);
        return;
      }

      if (!allowedImageTypes.includes(file.type)) {
        updateField(field, null);
        event.target.value = "";

        setErrors((prev) => ({
          ...prev,
          photo: t("register_form.photo.unsupported"),
        }));

        setIsSubmitted(true);
        return;
      }

      updateField(field, file);

      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    },
    [t, updateField],
  );

  const validateStep = () => {
    const nextErrors: ErrorMap = {};

    if (currentStep === 0) {
      if (!data.username.trim()) {
        nextErrors.username = t("register_form.errors.username_required");
      }

      if (!data.password.trim()) {
        nextErrors.password = t("register_form.errors.password_required");
      }

      if (!confirmPassword.trim()) {
        nextErrors.confirmPassword = t(
          "register_form.errors.confirm_password_required",
        );
      } else if (data.password !== confirmPassword) {
        nextErrors.confirmPassword = t(
          "register_form.errors.password_mismatch",
        );
      }

      if (liveErrors.username) {
        nextErrors.username = liveErrors.username;
      }
    }

    if (currentStep === 1) {
      if (!data.email.trim()) {
        nextErrors.email = t("register_form.errors.email_required");
      }

      if (liveErrors.email) {
        nextErrors.email = liveErrors.email;
      }
    }

    if (currentStep === 2) {
      if (!data.verificationCode.trim()) {
        nextErrors.verificationCode = t(
          "register_form.errors.verification_required",
        );
      }
    }

    if (currentStep === 3) {
      if (!data.userType) {
        nextErrors.userType = t("register_form.errors.userType_required");
      }
    }

    if (currentStep === 4 && data.userType === "reader") {
      if (!data.lastName.trim()) {
        nextErrors.lastName = t("register_form.errors.lastName_required");
      }

      if (!data.firstName.trim()) {
        nextErrors.firstName = t("register_form.errors.firstName_required");
      }

      if (!data.phone_number.trim()) {
        nextErrors.phone_number = t("register_form.errors.phone_required");
      }

      if (errors.photo) {
        nextErrors.photo = errors.photo;
      }
    }

    if (currentStep === 4 && data.userType === "author") {
      if (!data.lastName.trim()) {
        nextErrors.lastName = t("register_form.errors.lastName_required");
      }

      if (!data.firstName.trim()) {
        nextErrors.firstName = t("register_form.errors.firstName_required");
      }

      if (!data.phone_number.trim()) {
        nextErrors.phone_number = t("register_form.errors.phone_required");
      }

      if (!data.specialization?.trim()) {
        nextErrors.specialization = t(
          "register_form.errors.specialization_required",
        );
      }

      if (!data.bio?.trim()) {
        nextErrors.bio = t("register_form.errors.bio_required");
      }

      if (errors.photo) {
        nextErrors.photo = errors.photo;
      }
    }

    if (currentStep === 4 && data.userType === "organization") {
      if (!data.organization_name?.trim()) {
        nextErrors.organization_name = t(
          "register_form.errors.organizationName_required",
        );
      }

      if (!data.legal_name?.trim()) {
        nextErrors.legal_name = t("register_form.errors.legalName_required");
      }

      if (errors.photo) {
        nextErrors.photo = errors.photo;
      }
    }

    const isContractStep = steps[currentStep]?.number === 6;

    if (isContractStep) {
      if (!data.contractAccepted) {
        nextErrors.contractAccepted = t(
          "register_form.errors.contract_required",
        );
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const checkCurrentUniqueFields = async () => {
    if (currentStep === 0) {
      const username = data.username.trim();

      if (!username) return false;

      const res = await checkUsername(username);

      if (res.data.exists) {
        const message = t("register_form.errors.username_exists");

        setErrors((prev) => ({
          ...prev,
          username: message,
        }));

        setLiveErrors((prev) => ({
          ...prev,
          username: message,
        }));

        return false;
      }
    }

    if (currentStep === 1) {
      const email = data.email.trim();

      if (!email) return false;

      const res = await checkEmail(email);

      if (res.data.exists) {
        const message = t("register_form.errors.email_exists");

        setErrors((prev) => ({
          ...prev,
          email: message,
        }));

        setLiveErrors((prev) => ({
          ...prev,
          email: message,
        }));

        return false;
      }
    }

    return true;
  };

  const handleStepCompletion = async () => {
    setIsSubmitted(true);

    if (!validateStep()) return;

    try {
      const isUniqueOk = await checkCurrentUniqueFields();

      if (!isUniqueOk) return;
    } catch (error) {
      console.log("CHECK ERROR:", error);
      return;
    }

    if (currentStep < steps.length - 1) {
      if (currentStep === 1) {
        const result = await sendVerificationCode(data.email);

        if (!result) {
          return;
        }

        if (result.code) {
          alert(`Ваш код подтверждения: ${result.code}`);
        }
      }

      if (currentStep === 2) {
        const verified = await verifyRegistrationCode(
          data.email,
          data.verificationCode,
        );

        if (!verified) {
          return;
        }
      }

      setCurrentStep((prev) => prev + 1);
      setIsSubmitted(false);
      setErrors({});
      return;
    }

    const success = await completeRegistration(data);

    if (success) {
      window.location.href = "/";
    }
  };

  const visibleErrors: ErrorMap = {
    ...(isSubmitted ? errors : {}),
    ...liveErrors,
  };

  const stepComponents = useMemo(() => {
    const base = [
      <Step1Credentials
        key="step1"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
        confirmPassword_val={confirmPassword}
        setConfirmPassword_val={setConfirmPassword}
        weakPasswordAccepted={weakPasswordAccepted}
        setWeakPasswordAccepted={setWeakPasswordAccepted}
      />,

      <Step2PersonalInfo
        key="step2"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
      />,

      <Step3Verification
        key="step3"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
        onResendCode={async () => {
          const result = await sendVerificationCode(data.email);

          if (result?.code) {
            alert(`Ваш код подтверждения: ${result.code}`);
          }
        }}
        codeLoading={codeLoading}
      />,

      <Step5UserType
        key="step4"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
      />,

      <Step6Details
        key="step5"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
        handleFileChange={handleFileChange}
      />,
    ];

    return [
      ...base,

      <Step7Contract
        key="step6"
        data={data}
        errors={visibleErrors}
        updateField={updateField}
      />,
    ];
  }, [
    data,
    visibleErrors,
    updateField,
    confirmPassword,
    weakPasswordAccepted,
    handleFileChange,
    sendVerificationCode,
    codeLoading,
  ]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-5xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleStepCompletion();
          }}
        >
          <RegisterForm
            steps={steps}
            currentStep={currentStep}
            stepComponent={stepComponents[currentStep]}
            isRegistered={isAuthenticated}
            isLoading={isLoading || loading || codeLoading}
            onPrev={handlePrev}
            onNext={handleStepCompletion}
            submitButtonText={
              currentStep === steps.length - 1
                ? t("register_form.buttons.submit")
                : t("register_form.buttons.next")
            }
          />
        </form>
      </div>
    </div>
  );
};

export default RegisterProcess;