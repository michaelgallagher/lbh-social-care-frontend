import { useRouter } from 'next/router';

import Seo from 'components/Layout/Seo/Seo';
import BackButton from 'components/Layout/BackButton/BackButton';
import PersonView from 'components/PersonView/PersonView';
import PersonDetails from 'components/PersonView/PersonDetails';
import Cases from 'components/Cases/Cases';
import AllocatedWorkers from 'components/AllocatedWorkers/AllocatedWorkers';
import WarningNotes from 'components/WarningNote/WarningNotes';

const PersonPage = (): React.ReactElement => {
  const { query } = useRouter();
  const personId = Number(query.id as string);
  return (
    <div>
      <Seo title={`Person Details - #${query.id}`} />
      <BackButton />
      <PersonView personId={personId} showPersonDetails={false}>
        {(person) => (
          <>
            <WarningNotes id={personId} />
            <PersonDetails person={person} />
            <AllocatedWorkers id={personId} />
            <Cases id={personId} person={person} />
          </>
        )}
      </PersonView>
    </div>
  );
};

export default PersonPage;
