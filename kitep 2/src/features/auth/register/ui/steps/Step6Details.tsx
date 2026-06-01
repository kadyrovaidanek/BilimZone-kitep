import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormInput } from '@/shared/ui/FormInput';
import { StepWrapper } from '@/shared/ui/StepWrapper';
import type { StepProps } from '../types';

type Step6Props = StepProps & {
  handleFileChange: (field: 'photo') => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const PhotoInput = ({
  photo,
  onChange,
  onRemove,
  error,
}: {
  photo: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  error?: string;
}) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (!photo) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('register_form.fields.photo')}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-300 bg-blue-50 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt={t('register_form.fields.photo')}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-blue-500 text-center px-2">
              {t('register_form.photo.empty')}
            </span>
          )}
        </div>

        <div className="flex-1">
          <input
            type="file"
            id="photo"
            accept=".jpg,.jpeg,.png"
            onChange={onChange}
            className="
              w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />

          <p className="mt-2 text-xs text-gray-500">
            {t('register_form.photo.supported')}
          </p>

          {photo && (
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xs text-gray-600 truncate max-w-[220px]">
                {photo.name}
              </span>

              <button
                type="button"
                onClick={onRemove}
                className="text-xs text-red-500 hover:underline"
              >
                {t('register_form.photo.remove')}
              </button>
            </div>
          )}

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export const Step6Details = memo(({ data, updateField, handleFileChange, errors }: Step6Props) => {
  const { t } = useTranslation();

  const removePhoto = () => {
    updateField('photo', null);
  };

  const commonPersonalFields = (
    <>
      <FormInput
        label={t('register_form.fields.lastName')}
        name="lastName"
        value={data.lastName}
        onChange={(e) => updateField('lastName', e.target.value)}
        error={errors.lastName}
      />

      <FormInput
        label={t('register_form.fields.firstName')}
        name="firstName"
        value={data.firstName}
        onChange={(e) => updateField('firstName', e.target.value)}
        error={errors.firstName}
      />

      <FormInput
        label={t('register_form.fields.fatherName')}
        name="fatherName"
        value={data.fatherName}
        onChange={(e) => updateField('fatherName', e.target.value)}
        error={errors.fatherName}
      />

      <FormInput
        label={t('register_form.fields.phone')}
        name="phone_number"
        value={data.phone_number}
        onChange={(e) => updateField('phone_number', e.target.value)}
        error={errors.phone_number}
      />
    </>
  );

  if (data.userType === 'reader') {
    return (
      <StepWrapper
        title={t('register_form.details.reader_title')}
        description={t('register_form.details.reader_description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonPersonalFields}

          <PhotoInput
            photo={data.photo}
            onChange={handleFileChange('photo')}
            onRemove={removePhoto}
            error={errors.photo}
          />
        </div>
      </StepWrapper>
    );
  }

  if (data.userType === 'author') {
    return (
      <StepWrapper
        title={t('register_form.details.author_title')}
        description={t('register_form.details.author_description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commonPersonalFields}

          <FormInput
            label={t('register_form.fields.specialization')}
            name="specialization"
            value={data.specialization || ''}
            onChange={(e) => updateField('specialization', e.target.value)}
            error={errors.specialization}
          />

          <FormInput
            label={t('register_form.fields.bio')}
            name="bio"
            value={data.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            isTextArea
            className="md:col-span-2 min-h-[130px] border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500"
            error={errors.bio}
          />

          <PhotoInput
            photo={data.photo}
            onChange={handleFileChange('photo')}
            onRemove={removePhoto}
            error={errors.photo}
          />
        </div>
      </StepWrapper>
    );
  }

  if (data.userType === 'organization') {
    return (
      <StepWrapper
        title={t('register_form.details.organization_title')}
        description={t('register_form.details.organization_description')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label={t('register_form.fields.organizationName')}
            name="organization_name"
            value={data.organization_name || ''}
            onChange={(e) => updateField('organization_name', e.target.value)}
            error={errors.organization_name}
          />

          <FormInput
            label={t('register_form.fields.legalName')}
            name="legal_name"
            value={data.legal_name || ''}
            onChange={(e) => updateField('legal_name', e.target.value)}
            error={errors.legal_name}
          />

          <FormInput
            label={t('register_form.fields.bio')}
            name="bio"
            value={data.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            isTextArea
            error={errors.bio}
          />

          <FormInput
            label={t('register_form.fields.address')}
            name="address"
            value={data.address || ''}
            onChange={(e) => updateField('address', e.target.value)}
            error={errors.address}
          />

          <FormInput
            label={t('register_form.fields.website')}
            name="website"
            value={data.website || ''}
            onChange={(e) => updateField('website', e.target.value)}
            error={errors.website}
          />

          <PhotoInput
            photo={data.photo}
            onChange={handleFileChange('photo')}
            onRemove={removePhoto}
            error={errors.photo}
          />
        </div>
      </StepWrapper>
    );
  }

  return null;
});