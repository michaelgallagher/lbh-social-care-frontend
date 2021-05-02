import React from 'react';
import { useForm } from 'react-hook-form';
import isPast from 'date-fns/isPast';
import isPostcodeValid from 'uk-postcode-validator';

import { TextInput, DateInput } from 'components/Form';
import Button from 'components/Button/Button';
import { useAuth } from 'components/UserContext/UserContext';
import { User } from 'types';
import ErrorMsg from 'components/ErrorMessage/ErrorMessage';
interface FormValues {
  first_name?: string;
  last_name?: string;
  date_of_birth?: string | null;
  postcode?: string;
  mosaic_id?: string;
}

interface Props {
  onFormSubmit: (formData?: FormValues) => void;
  defaultValues: FormValues;
  ctaText?: string;
}

const SearchResidentsForm = ({
  onFormSubmit,
  defaultValues,
  ctaText = 'Search',
}: Props): React.ReactElement => {
  const {
    register,
    errors,
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues,
  });
  const { user } = useAuth() as { user: User };

  if (user?.hasInspectorPermission) {
    return (
      <ErrorMsg label="You do not have permission to access this feature" />
    );
  }
  return (
    <form role="form" onSubmit={handleSubmit((data) => onFormSubmit(data))}>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="First name:"
            labelSize="s"
            name="first_name"
            error={errors.first_name}
            register={register}
          />
        </div>
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="Last name:"
            labelSize="s"
            name="last_name"
            error={errors.last_name}
            register={register}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <DateInput
            label="Date of Birth:"
            labelSize="s"
            name="date_of_birth"
            error={errors.date_of_birth}
            control={control}
            rules={{
              validate: {
                past: (value) =>
                  value && (isPast(new Date(value)) || 'Must be a past Date'),
              },
            }}
          />
        </div>
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="Postcode:"
            labelSize="s"
            name="postcode"
            hint="i.e. E8 3AS"
            inputClassName="govuk-input--width-10"
            error={errors.postcode}
            register={register}
            rules={{
              validate: {
                valid: (value) =>
                  value === '' ||
                  (value && isPostcodeValid(value)) ||
                  'You entered an invalid postcode',
              },
            }}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="Mosaic ID:"
            labelSize="s"
            name="mosaic_id"
            hint="e.g. 1234567890"
            inputClassName="govuk-input--width-10"
            inputMode="numeric"
            error={errors.mosaic_id}
            register={register}
          />
        </div>
      </div>
      <Button label={ctaText} type="submit" disabled={!isDirty} />
      <span
        className="govuk-link"
        role="button"
        onClick={() => {
          reset({
            date_of_birth: null,
          });
          onFormSubmit();
        }}
        style={{
          marginLeft: '1rem',
          lineHeight: '2.5rem',
        }}
      >
        Clear {ctaText.toLowerCase()}
      </span>
    </form>
  );
};

export default SearchResidentsForm;
