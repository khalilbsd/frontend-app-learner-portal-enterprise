import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@edx/frontend-platform/react';
import classNames from 'classnames';

import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../../../messages';

/**
 * A 'Continue Learning' button with parameters.
 *
 * @param {object} params Params.
 * @param {string} params.linkToCourse hyperlink to course on LMS.
 * @param {string} params.title course title.
 * @param {Function} params.courseRunId
 *
 * @returns {Function} A functional React component for the continue learning button.
 */
function ContinueLearningButton({
  className,
  linkToCourse,
  title,
  courseRunId,
  intl
}) {
  const { enterpriseConfig } = useContext(AppContext);

  const onClickHandler = () => {
    sendEnterpriseTrackEvent(
      enterpriseConfig.uuid,
      'edx.ui.enterprise.learner_portal.dashboard.course.continued',
      {
        course_run_id: courseRunId,
      },
    );
  };
  return (
    <a
      className={classNames('btn btn-xs-block', className)}
      href={linkToCourse}
      onClick={onClickHandler}
    >
      {intl.formatMessage(messages['tab.courses.main.dashboard.course.card.btn.resume'])}

    </a>
  );
}

ContinueLearningButton.defaultProps = {
  className: 'btn-outline-primary',
};

ContinueLearningButton.propTypes = {
  className: PropTypes.string,
  linkToCourse: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  courseRunId: PropTypes.string.isRequired,
};



export default (injectIntl(ContinueLearningButton))