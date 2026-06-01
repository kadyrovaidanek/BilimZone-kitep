import { useState } from "react";
import axios from "axios";

import type { UserRegistrationData } from "@/entities/user/model/types";

const API = axios.create({
  baseURL: "https://bilimzone-backend1.onrender.com/api",
});

const buildReaderPayload = (data: UserRegistrationData) => ({
  surname: data.lastName,
  first_name: data.firstName,
  father_name: data.fatherName,
  phone_number: data.phone_number,
});

const buildAuthorPayload = (data: UserRegistrationData) => ({
  surname: data.lastName,
  first_name: data.firstName,
  father_name: data.fatherName,
  phone_number: data.phone_number,
  specialization: data.specialization,
  bio: data.bio,
});

const buildOrganizationPayload = (data: UserRegistrationData) => ({
  organization_name: data.organization_name,
  full_name: data.legal_name,
  bio: data.bio,
  address: data.address,
  website: data.website,
});

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const sendVerificationCode = async (email: string) => {
    setCodeLoading(true);

    try {
      const response = await API.post("/register/send-code/", {
        email,
      });

      return response.data;
    } catch (error) {
      console.log("SEND CODE ERROR:", error);
      return null;
    } finally {
      setCodeLoading(false);
    }
  };
  const verifyRegistrationCode = async (email: string, code: string) => {
    try {
      setCodeLoading(true);

      await API.post("/register/verify-code/", {
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      return true;
    } catch (error: any) {
      console.log("VERIFY CODE ERROR:", error);

      const message =
        error?.response?.data?.verification_code ||
        error?.response?.data?.email ||
        "Неверный код подтверждения";

      alert(message);
      return false;
    } finally {
      setCodeLoading(false);
    }
  };
  const completeRegistration = async (data: UserRegistrationData) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("username", data.username.trim());
      formData.append("email", data.email.trim().toLowerCase());
      formData.append("password", data.password);
      formData.append("role", data.userType);
      formData.append("verification_code", data.verificationCode.trim());

      formData.append(
        "agreement_accepted",
        data.contractAccepted ? "true" : "false",
      );

      if (data.userType === "reader") {
        formData.append("reader", JSON.stringify(buildReaderPayload(data)));
      }

      if (data.userType === "author") {
        formData.append("author", JSON.stringify(buildAuthorPayload(data)));
      }

      if (data.userType === "organization") {
        formData.append(
          "organization",
          JSON.stringify(buildOrganizationPayload(data)),
        );
      }

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      await API.post("/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return true;
    } catch (error: any) {
      console.log("REGISTER ERROR:", error);

      const message =
        error?.response?.data?.verification_code ||
        error?.response?.data?.email ||
        "Ошибка регистрации. Проверьте данные и попробуйте снова.";

      alert(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    completeRegistration,
    sendVerificationCode,
    verifyRegistrationCode,
    loading,
    codeLoading,
  };
};