import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AlertModal, Alert, StatefulButton, Button, ActionRow,
} from '@edx/paragon';
import { logError } from '@edx/frontend-platform/logging';

import { CourseEnrollmentsContext } from '../../CourseEnrollmentsContextProvider';
import { ToastsContext } from '../../../../../Toasts';
import { unenrollFromCourse } from './data';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../../../../messages';

const btnLabels = {
  default: 'Unenroll',
  pending: 'Unenrolling...',
};

 function UnenrollModal({
  courseRunId,
  enrollmentType,
  isOpen,
  onClose,
  onSuccess,
  intl
}) {
  const { removeCourseEnrollment } = useContext(CourseEnrollmentsContext);
  const { addToast } = useContext(ToastsContext);

  const [btnState, setBtnState] = useState('default');
  const [error, setError] = useState(null);

  const handleClose = () => {
    setBtnState('default');
    setError(null);
    onClose();
  };

  const handleUnenrollButtonClick = async () => {
    setBtnState('pending');
    try {
      await unenrollFromCourse({
        courseId: courseRunId,
      });
      removeCourseEnrollment({ courseRunId, enrollmentType });
      addToast('You have been unenrolled from the course.');
      onSuccess();
    } catch (err) {
      logError(err);
      setError(err);
      setBtnState('default');
    }
  };

  return (
    <AlertModal
      title="Unenroll from course?"
      isOpen={isOpen}
      onClose={handleClose}
      footerNode={(
        <ActionRow>
          <Button
            variant="tertiary"
            onClick={handleClose}
          >
            {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.unenroll.modal.btn.keep'])}
          </Button>
          <StatefulButton
            variant="primary"
            labels={btnLabels}
            state={btnState}
            onClick={handleUnenrollButtonClick}
          >
           {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.unenroll'])}
          </StatefulButton>
        </ActionRow>
      )}
    >
      <>
        <Alert
          variant="danger"
          show={!!error}
        >
          <p data-testid="unenroll-error-text">
          {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.unenroll.modal.error'])}

          </p>
        </Alert>
        <p>
          {intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.unenroll.modal.progress'])}
        </p>
      </>
    </AlertModal>
  );
}

UnenrollModal.propTypes = {
  courseRunId: PropTypes.string.isRequired,
  enrollmentType: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};


export default ((injectIntl(UnenrollModal)))