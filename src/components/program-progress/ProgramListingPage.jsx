import React, {
  useContext,
} from 'react';
import {
  Row,
  Container,
  Button,
} from '@edx/paragon';
import { AppContext, ErrorPage } from '@edx/frontend-platform/react';
import './styles/index.scss';

import { Search } from '@edx/paragon/icons';

import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../loading-spinner';

import { useLearnerProgramsListData } from './data/hooks';
import { NO_PROGRAMS_ERROR_MESSAGE } from './data/constants';
import ProgramListingCard from './ProgramListingCard';

import { CONTENT_TYPE_PROGRAM } from '../search/constants';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const ProgramListingPage = ({intl}) => {
  const { enterpriseConfig } = useContext(AppContext);

  const [learnerProgramsData, fetchError] = useLearnerProgramsListData(enterpriseConfig.uuid);

  if (fetchError) {
    return <ErrorPage message={fetchError.message} />;
  }

  if (!learnerProgramsData) {
    return (
      <Container size="lg" className="py-5">
        <LoadingSpinner screenReaderText="loading program" />
      </Container>
    );
  }

  return (
    <>
      <Container size="lg" className="py-5 w-100">
        <Row>
          {learnerProgramsData.length > 0 ? (
            learnerProgramsData.map((program) => <ProgramListingCard program={program} key={program.title} />)
          ) : (
            <div className="no-content-message">
              <h2 style={{textAlign:'center',marginBottom:'10%'}}>{intl.formatMessage(messages[NO_PROGRAMS_ERROR_MESSAGE])}</h2>
              <Link to={`/${enterpriseConfig.slug}/search?content_type=${CONTENT_TYPE_PROGRAM}`}>
                <Button variant="primary" iconBefore={Search} className="btn-brand-primary mt-2">{intl.formatMessage(messages['tab.programs.not.enrolled.btn'])}</Button>
              </Link>
            </div>
          )}
        </Row>
      </Container>
    </>
  );
};

export default (injectIntl(ProgramListingPage));
