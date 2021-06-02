import { useRouter } from 'next/router';
import PersonView from 'components/PersonView/PersonView';
import Seo from 'components/Layout/Seo/Seo';

const AddNewRelationshipPage = (): React.ReactElement => {
  const { query } = useRouter();
  const personId = Number(query.id as string);
  return (
    <>
      <Seo title={`Add a new relationship for #${query.id}`} />
      <h1 className="govuk-fieldset__legend--l gov-weight-lighter">
        Add a new relationship for
      </h1>
      <PersonView personId={personId} expandView>
        {(person) => (
          <>
            <p className="lbh-label govuk-!-margin-top-7 govuk-!-margin-bottom-5">
              Create a new relationship for{' '}
              {`${person.firstName} ${person.lastName}`}
              {
                //to do
              }
            </p>
          </>
        )}
      </PersonView>
    </>
  );
};

AddNewRelationshipPage.goBackButton = true;

export default AddNewRelationshipPage;
