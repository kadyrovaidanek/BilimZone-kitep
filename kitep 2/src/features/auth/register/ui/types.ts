import type { UserRegistrationData } from '@/entities/user/model/types';

export type StepProps = {
  data: UserRegistrationData;
  errors: Partial<Record<keyof UserRegistrationData | 'confirmPassword', string>>;
  updateField: <K extends keyof UserRegistrationData>(
    field: K,
    value: UserRegistrationData[K]
  ) => void;
};