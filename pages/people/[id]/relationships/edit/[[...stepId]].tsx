import { useRouter } from 'next/router';
import PersonView from 'components/PersonView/PersonView';
import Seo from 'components/Layout/Seo/Seo';

const AddNewRelationshipPage = (): React.ReactElement => {
  const { query } = useRouter();
  const personId = Number(query.id as string);
  return (
    <>
      <Seo title={`Edit relationship for #${query.id}`} />
      <h1 className="govuk-fieldset__legend--l gov-weight-lighter">
        Edit relationship for
      </h1>
      <PersonView personId={personId} expandView>
        {(person) => (
          <>
            <p className="lbh-label govuk-!-margin-top-7 govuk-!-margin-bottom-5">
              Edit pre-existing relationship for{' '}
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
