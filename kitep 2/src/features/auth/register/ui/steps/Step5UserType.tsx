import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { StepProps } from '../types';

import readerImg from '@/assets/images/reader.svg';
import authorImg from '@/assets/images/author.svg';
import schoolImg from '@/assets/images/school.svg';

export const Step5UserType = memo(({ data, errors, updateField }: StepProps) => {
  const { t } = useTranslation();

  const options = [
    {
      id: 'reader',
      label: t('register_form.user_type.options.reader.title'),
      description: t('register_form.user_type.options.reader.description'),
      image: readerImg,
    },
    {
      id: 'author',
      label: t('register_form.user_type.options.author.title'),
      description: t('register_form.user_type.options.author.description'),
      image: authorImg,
    },
    {
      id: 'organization',
      label: t('register_form.user_type.options.organization.title'),
      description: t('register_form.user_type.options.organization.description'),
      image: schoolImg,
    },
  ] as const;

  const selected = options.find((option) => option.id === data.userType);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-slate-800">
        {t('register_form.user_type.title')}
      </h2>

      <p className="text-slate-500 mt-2 mb-8">
        {t('register_form.user_type.subtitle')}
      </p>

      {errors.userType && <p className="text-red-500 mb-4">{errors.userType}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => updateField('userType', option.id)}
            className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 flex flex-col items-center gap-4 shadow-sm ${data.userType === option.id
                ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
              }`}
          >
            <img src={option.image} alt={option.label} className="w-16 h-16 object-contain" />
            <span className="font-semibold text-slate-700">{option.label}</span>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-left">
          <p className="text-sm leading-6 text-slate-700">{selected.description}</p>
        </div>
      )}
    </div>
  );
});