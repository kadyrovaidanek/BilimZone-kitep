import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/shared/ui/FormInput';
import { StepWrapper } from '@/shared/ui/StepWrapper';
import type { StepProps } from '../types';

export const Step2PersonalInfo = memo(({ data, errors, updateField }: StepProps) => {
  const { t } = useTranslation();

  return (
    <StepWrapper
      title={t('register_form.step2.title')}
      description={t('register_form.step2.description')}
    >
      <FormInput
        label={t('register_form.step2.email')}
        name="email"
        type="email"
        value={data.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
      />
    </StepWrapper>
  );
});