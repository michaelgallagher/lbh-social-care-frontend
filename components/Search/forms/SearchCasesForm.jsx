import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import isPast from 'date-fns/isPast';

import {
  Button,
  TextInput,
  Checkbox,
  DateInput,
  Select,
} from 'components/Form';
import CASE_NOTE_TYPES from 'data/caseNoteTypes';

const SearchCasesForm = ({ onFormSubmit, query }) => {
  const {
    register,
    errors,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: query,
  });
  useEffect(() => {
    Object.keys(query).length && onFormSubmit(query);
  }, []);
  return (
    <form role="form" onSubmit={handleSubmit((data) => onFormSubmit(data))}>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="First name:"
            labelSize="s"
            name="first_name"
            error={errors.first_name}
            register={register({
              minLength: {
                value: 2,
                message: 'Requires at least a minimum of 2 letters.',
              },
            })}
          />
        </div>
        <div className="govuk-grid-column-one-half">
          <TextInput
            label="Last name:"
            labelSize="s"
            name="last_name"
            error={errors.last_name}
            register={register({
              minLength: {
                value: 2,
                message: 'Requires at least a minimum of 2 letters.',
              },
            })}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <Checkbox
            label="Search by exact match"
            labelSize="s"
            name="exact_name_match"
            register={register}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <DateInput
            label="Date created from:"
            labelSize="s"
            name="start_date"
            format="EU"
            error={errors.start_date}
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
          <DateInput
            label="Date created to:"
            labelSize="s"
            name="end_date"
            format="EU"
            error={errors.end_date}
            control={control}
            rules={{
              validate: {
                past: (value) =>
                  value && (isPast(new Date(value)) || 'Must be a past Date'),
              },
            }}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <Select
            name="case_note_type"
            label="Filter by form type:"
            labelSize="s"
            register={register}
            options={CASE_NOTE_TYPES}
          />
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <Checkbox
            label="Only include records I've created"
            name="my_notes_only"
            register={register}
          />
        </div>
      </div>

      <Button label="Search" type="submit" disabled={!isDirty} />
    </form>
  );
};

SearchCasesForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  query: PropTypes.shape({}),
};

export default SearchCasesForm;
