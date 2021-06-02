import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import Spinner from 'components/Spinner/Spinner';
import { useRelationships } from 'utils/api/relationships';
import RelationshipElement from './RelationshipElement';
import { canUserEditPerson } from '../../lib/permissions';
import { useAuth } from 'components/UserContext/UserContext';
import { User, Resident } from 'types';
import Button from 'components/Button/Button';

interface Props {
  id: number;
  person: Resident;
}

const Relationships = ({ id, person }: Props): React.ReactElement => {
  const { user } = useAuth() as { user: User };
  const { data: { personalRelationships } = {}, error } = useRelationships(id);

  if (!personalRelationships) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorMessage />;
  }

  const userCanManageRelationships = canUserEditPerson(user, person);

  const shouldAppear =
    (personalRelationships.parents &&
      personalRelationships.parents.length > 0) ||
    (personalRelationships.children &&
      personalRelationships.children.length > 0) ||
    (personalRelationships.siblings &&
      personalRelationships.siblings.length > 0) ||
    (personalRelationships.other && personalRelationships.other.length > 0);

  return (
    <div>
      <div>
        <div className="lbh-table-header">
          <h3 className="govuk-fieldset__legend--m govuk-custom-text-color">
            RELATIONSHIPS
          </h3>
          {userCanManageRelationships && (
            <Button
              isSecondary
              label="Add a new relationship"
              route={`${id}/relationships/add`}
            />
          )}
        </div>
        <hr className="govuk-divider" />
        {!shouldAppear && (
          <p>
            <i>No relationship found</i>
          </p>
        )}

        {
          <dl className="govuk-summary-list lbh-summary-list">
            {
              <RelationshipElement
                title="Parents"
                data={personalRelationships.parents}
              />
            }
            {
              <RelationshipElement
                title="Children"
                data={personalRelationships.children}
              />
            }
            {
              <RelationshipElement
                title="Siblings"
                data={personalRelationships.siblings}
              />
            }
            {
              <RelationshipElement
                title="Other"
                data={personalRelationships.other}
              />
            }
          </dl>
        }
      </div>
      {error && <ErrorMessage />}
    </div>
  );
};

export default Relationships;
