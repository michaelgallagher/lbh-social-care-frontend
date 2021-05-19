import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { startSchema } from 'lib/validators';
import { yupResolver } from '@hookform/resolvers/yup';
import { TypeOf } from 'yup';
import TextField from './TextField';
import { useRouter } from 'next/router';

type FormData = TypeOf<typeof startSchema>;

interface Props {
  onSubmit: (values: FormData, setStatus: (message: string) => void) => void;
}

const StartForm = ({ onSubmit }: Props): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touched },
  } = useForm({
    resolver: yupResolver(startSchema),
  });

  const [status, setStatus] = useState<string | null>(null);

  const { query } = useRouter();

  return (
    <form onSubmit={handleSubmit((values) => console.log(values))}>
      {status}

      {/* {!query.social_care_id && (
        <TextField
          name="socialCareId"
          label="Social care ID"
          hint="For example, 12345678"
          touched={touched}
          errors={errors}
          className="govuk-input--width-10"
          {...register('socialCareId')}
        />
      )} */}

      <input {...register('socialCareId')} />

      <input {...register('formId')} />

      <button className="govuk-button lbh-button" disabled={isSubmitting}>
        Continue
      </button>
    </form>
  );
};

export default StartForm;
