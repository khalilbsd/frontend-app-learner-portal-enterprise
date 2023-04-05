import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import {
  Button, breakpoints, MediaQuery,
} from '@edx/paragon';

import { CourseEnrollments } from './course-enrollments';

import SupportInformation from '../sidebar/SupportInformation';
import SubsidiesSummary from '../sidebar/SubsidiesSummary';
import CourseRecommendations from './CourseRecommendations';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from '../messages';

const DashboardMainContent = ({ intl }) => {
  const {
    enterpriseConfig: {
      name,
      slug,
      disableSearch,
    },
  } = useContext(AppContext);

  return (
    <>
      <MediaQuery maxWidth={breakpoints.medium.maxWidth}>
        {matches => (matches ? (
          <SubsidiesSummary />
        ) : null)}
      </MediaQuery>
      <CourseEnrollments>
        {/* The children below will only be rendered if there are no course enrollments. */}
        {disableSearch ? (
          <p>
            You are not enrolled in any courses sponsored by {name}.
            Reach out to your administrator for instructions on how to start learning learning with edX!
          </p>
        ) : (
          <>
            <br />
            <CourseRecommendations />
          </>
        )}
      </CourseEnrollments>


    </>
  );
};

export default (injectIntl(DashboardMainContent));
