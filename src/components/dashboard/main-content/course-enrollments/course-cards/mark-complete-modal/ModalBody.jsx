import React, { useContext } from 'react';

import ModalError from './ModalError';
import MarkCompleteModalContext from './MarkCompleteModalContext';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../../../../messages';

const ModalBody = ({intl}) => {
  const {
    confirmError,
    courseLink,
    courseTitle,
  } = useContext(MarkCompleteModalContext);
  return (
    <>
      {confirmError && <ModalError />}
      <p className="m-0">
       {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.save.later.model.body.asking.confirmation'])}
        {' '}
        <a href={courseLink}>{courseTitle}</a>
        {' '}
      {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.save.later.model.body.text'])}
      </p>
      <p className="mt-2">
       {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.save.later.model.body.license.text'])}
      </p>
    </>
  );
};

export default (injectIntl(ModalBody));
