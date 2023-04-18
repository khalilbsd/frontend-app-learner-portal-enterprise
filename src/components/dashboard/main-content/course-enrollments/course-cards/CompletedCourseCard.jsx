import React from 'react';
import PropTypes from 'prop-types';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';

import BaseCourseCard from './BaseCourseCard';
import ContinueLearningButton from './ContinueLearningButton';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { isCourseEnded } from '../../../../../utils/common';
import CertificateImg from './images/edx-verified-mini-cert.png';
import messages from './messages';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CompletedCourseCard = (props) => {
  const user = getAuthenticatedUser();
  const { username } = user;
  const {
    title,
    linkToCourse,
    courseRunId,
    endDate,
    intl
  } = props;
  const config = getConfig();

  const renderButtons = () => {
    if (isCourseEnded(endDate)) {
      return null;
    }

    return (
      <ContinueLearningButton
        linkToCourse={linkToCourse}
        title={title}
        courseRunId={courseRunId}
      />
    );
  };

  const renderCertificateInfo = () => (
    props.linkToCertificate ? (
      <div className="d-flex mb-3">
        <div className="mr-3">
          <img src={CertificateImg} alt="verified certificate preview" />
        </div>
        <div className="d-flex align-items-center">
          <p className="mb-0">
           {intl.formatMessage(messages['course.cards.completed.view.certificate'])}
            <a className='custom-link' href={`${config.LMS_BASE_URL}/u/${username}`}>
              {intl.formatMessage(messages['course.cards.completed.view.certificate.profile'])}
              <FontAwesomeIcon className="ml-3 chevron-right" icon={faChevronRight} />
            </a>
          </p>
        </div>
      </div>
    ) : (
      <p className="mb-3">
       {intl.formatMessage(messages['course.cards.completed.to.earn.one'])}
        <a  className='custom-link' href={props.linkToCourse}>
          {intl.formatMessage(messages['course.cards.completed.to.earn.one.retake'])}
          <FontAwesomeIcon className="ml-3 chevron-right" icon={faChevronRight} />
        </a>
      </p>
    )
  );

  return (
    <BaseCourseCard
      buttons={renderButtons()}
      type="completed"
      hasViewCertificateLink={false}
      {...props}
    >
      {renderCertificateInfo()}
    </BaseCourseCard>
  );
};

CompletedCourseCard.propTypes = {
  linkToCourse: PropTypes.string.isRequired,
  courseRunId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  linkToCertificate: PropTypes.string,
  courseRunStatus: PropTypes.string.isRequired,
  endDate: PropTypes.string,
};

CompletedCourseCard.defaultProps = {
  linkToCertificate: null,
  endDate: null,
};

export default (injectIntl(CompletedCourseCard));
