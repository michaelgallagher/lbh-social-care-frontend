import Seo from 'components/Layout/Seo/Seo';
import MyAllocatedCases from 'components/AllocatedCases/MyAllocatedCases';
import DashboardWrapper from 'components/Dashboard/DashboardWrapper';
import { GetServerSideProps } from 'next';

const MyCasesPage = (): React.ReactElement => (
  <div>
    <Seo title="My Work Space" />
    <DashboardWrapper>
      <>
        <p className="govuk-body">Clients you are currently managing</p>
        <MyAllocatedCases />
      </>
    </DashboardWrapper>
  </div>
);

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
    redirect: {
      destination: '/search',
    },
  };
};

export default MyCasesPage;
