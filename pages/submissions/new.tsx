import { GetServerSideProps } from 'next';
import StartForm from 'components/StartForm/StartForm';
import { useRouter } from 'next/router';
import { Form } from 'data/flexibleForms/forms.types';

import { getProtocol } from 'utils/urls';

interface Props {
  forms: Form[];
}

const StartPage = ({ forms }: Props): React.ReactElement => {
  const router = useRouter();

  const handleSubmit = async (values, { setStatus }) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/submissions`,
        {
          method: 'POST',
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();
      if (data.error) throw data.error;
      router.push(`/submissions/${data.id}`);
    } catch (e) {
      setStatus(e.toString());
    }
  };

  return (
    <div>
      <h1 className="lbh-heading-h1 govuk-!-margin-bottom-8">
        Record something new
      </h1>

      {forms && <StartForm onSubmit={handleSubmit} forms={forms} />}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = getProtocol();

  const res2 = await fetch(
    `${protocol}://${process.env.REDIRECT_URL}/api/submissions`,
    {
      headers: {
        cookie: req.headers.cookie,
      } as HeadersInit,
    }
  );
  const data = await res2.json();
  return {
    props: {
      ...data,
    },
  };
};

export default StartPage;
