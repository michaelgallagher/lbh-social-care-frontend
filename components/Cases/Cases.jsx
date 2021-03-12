import PropTypes from 'prop-types';

import CasesTable from 'components/Cases/CasesTable';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import ErrorSummary from 'components/ErrorSummary/ErrorSummary';
import Button from 'components/Button/Button';
import Spinner from 'components/Spinner/Spinner';
import { useAuth } from 'components/UserContext/UserContext';
import { useCasesByResident } from 'utils/api/cases';

const Cases = ({ id }) => {
  const { data, size, setSize, error } = useCasesByResident(id);
  const results = data?.length > 0 && {
    cases: data.reduce((acc, { cases }) => [...acc, ...cases], []),
    nextCursor: data[data.length - 1].nextCursor,
  };
  if (error) {
    return <ErrorMessage />;
  }
  if (!results) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <>
      {results?.cases.length > 0 ? (
        <CasesTable records={results.cases} />
      ) : (
        <p className="govuk-body govuk-!-margin-top-5">Records not found</p>
      )}
      <div style={{ height: '50px', textAlign: 'center' }}>
        {size > data.length ? (
          <Spinner />
        ) : (
          results?.nextCursor && (
            <Button label="load more" onClick={() => setSize(size + 1)} />
          )
        )}
      </div>
    </>
  );
};

Cases.propTypes = {
  id: PropTypes.number.isRequired,
};

const CasesWrapper = ({ id, person }) => {
  const { user } = useAuth();
  return (
    <div>
      <div className="lbh-table-header">
        <div>
          <h3 className="govuk-fieldset__legend--m govuk-custom-text-color">
            RECORDS HISTORY
          </h3>
          <span className="govuk-body">Linked files are read only</span>
        </div>
        <Button label="Add a new record" route={`${id}/records`} />
      </div>
      <hr className="govuk-divider" />
      {user.hasUnrestrictedPermissions || !person.restricted ? (
        <Cases id={id} />
      ) : (
        <ErrorSummary
          title="RESTRICTED"
          body="The records for this profile are restricted for viewing"
        />
      )}
    </div>
  );
};

CasesWrapper.propTypes = {
  id: PropTypes.number.isRequired,
  person: PropTypes.shape({
    restricted: PropTypes.bool,
  }).isRequired,
};

export default CasesWrapper;
