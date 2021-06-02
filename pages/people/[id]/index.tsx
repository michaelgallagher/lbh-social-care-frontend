import { useRouter } from 'next/router';

import Seo from 'components/Layout/Seo/Seo';
import PersonView from 'components/PersonView/PersonView';
import PersonDetails from 'components/PersonView/PersonDetails';
import Cases from 'components/Cases/Cases';
import AllocatedWorkers from 'components/AllocatedWorkers/AllocatedWorkers';
import Relationships from 'components/Relationships/Relationships';
import WarningNotes from 'components/WarningNote/WarningNotes';
import Stack from 'components/Stack/Stack';
import { useAuth } from 'components/UserContext/UserContext';
import { User } from 'types';

const canViewArea = (user: User) => {
  if (user.hasDevPermissions) {
    return true;
  }

  return false;
};

const PersonPage = (): React.ReactElement => {
  const { query } = useRouter();

  const { user } = useAuth() as { user: User };
  const personId = Number(query.id as string);

  return (
    <>
      <Seo title={`Person Details - #${query.id}`} />
      <PersonView personId={personId} showPersonDetails={false}>
        {(person) => (
          <Stack space={7} className="govuk-!-margin-top-7">
            {canViewArea(user) ? <WarningNotes id={personId} /> : <></>}
            <PersonDetails person={person} />
            <AllocatedWorkers person={person} />
            {canViewArea(user) ? (
              <Relationships id={personId} person={person} />
            ) : (
              <></>
            )}
            <Cases id={personId} person={person} />
          </Stack>
        )}
      </PersonView>
    </>
  );
};

PersonPage.goBackButton = true;

export default PersonPage;
