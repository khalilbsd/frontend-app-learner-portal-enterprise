import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  breakpoints, Container, Row, MediaQuery,
} from '@edx/paragon';
import { ErrorPage } from '@edx/frontend-platform/react';
import { LoadingSpinner } from '../loading-spinner';
import {
  ProgramProgressContextProvider,
} from './ProgramProgressContextProvider';
import ProgramProgressHeader from './ProgramProgressHeader';
import ProgramProgressSideBar from './ProgramProgressSidebar';
import ProgramProgressCourses from './ProgramProgressCourses';

import { useLearnerProgramProgressData } from './data/hooks';
import { CourseEnrollmentsContextProvider } from '../dashboard/main-content/course-enrollments';
import {
  getCoursesEnrolledInAuditMode,
  getNotStartedEnrollableCourseRuns,
  getLastEndingCourseDate,
} from './data/utils';

import SubsidiesSummary from '../dashboard/sidebar/SubsidiesSummary';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const ProgramProgressPage = ({intl}) => {
  const { programUUID } = useParams();
  const [program, fetchError] = useLearnerProgramProgressData(programUUID);

  const initialState = useMemo(
    () => {
      if (!program) {
        return undefined;
      }
      return program.data;
    },
    [program],
  );
  const courseData = program?.data?.courseData;
  const totalCoursesInProgram = courseData?.notStarted?.length
    + courseData?.completed?.length
    + courseData?.inProgress?.length;
  const allCoursesCompleted = !courseData?.notStarted?.length
    && !courseData?.inProgress?.length
    && courseData?.completed?.length;

  const coursesNotStarted = courseData?.notStarted;
  const totalCoursesNotStarted = coursesNotStarted?.length;
  let enrolledCourses = [];
  if (courseData?.completed?.length) {
    enrolledCourses = courseData.completed;
  }
  if (courseData?.inProgress?.length) {
    enrolledCourses = [...enrolledCourses, ...courseData.inProgress];
  }
  const coursesEnrolledInAuditMode = getCoursesEnrolledInAuditMode(enrolledCourses);
  const totalCoursesEligibleForCertificate = totalCoursesNotStarted + coursesEnrolledInAuditMode?.length;
  let courseEndDate;
  if (totalCoursesEligibleForCertificate) {
    const notStartedEnrollableCourseRuns = getNotStartedEnrollableCourseRuns(coursesNotStarted);
    const subsidyEligibleCourseRuns = [...notStartedEnrollableCourseRuns, ...coursesEnrolledInAuditMode];

    courseEndDate = getLastEndingCourseDate(subsidyEligibleCourseRuns);
  }
  if (fetchError) {
    return <ErrorPage message={fetchError.message} />;
  }

  if (!initialState) {
    return (
      <Container size="lg" className="py-5">
        <LoadingSpinner screenReaderText="loading program progress" />
      </Container>
    );
  }
  const PROGRAM_TITLE = `${initialState.programData.title}`;
  return (
    <>
      <Helmet title={PROGRAM_TITLE} />

      <CourseEnrollmentsContextProvider>
        <ProgramProgressContextProvider initialState={initialState}>
          <Container fluid={false} size="lg">
            <ProgramProgressHeader />
            <Row>
              <article className="col-8">
                {allCoursesCompleted
                  ? (
                    <>
                      <h3>{intl.formatMessage(messages['program.progress.page.congratulation'])}</h3>
                      <p>{intl.formatMessage(messages['program.progress.page.congratulation.message'],{PROGRAM_TITLE})}</p>
                    </>
                  )
                  : (
                    <>
                      <h3>{intl.formatMessage(messages['program.progress.page.congratulation.journey'])}</h3>
                      <p> {intl.formatMessage(messages['program.progress.page.congratulation.track'],{totalCoursesInProgram})}</p>
                      <p>{intl.formatMessage(messages['program.progress.page.congratulation.certificate'])}</p>
                    </>
                  )}
                <SubsidiesSummary
                  totalCoursesEligibleForCertificate={totalCoursesEligibleForCertificate}
                  courseEndDate={courseEndDate}
                  programProgressPage
                />
                <ProgramProgressCourses courseData={courseData} />
              </article>

              <MediaQuery minWidth={breakpoints.large.minWidth}>
                {matches => matches && (
                  <ProgramProgressSideBar />
                )}
              </MediaQuery>
            </Row>
          </Container>
        </ProgramProgressContextProvider>
      </CourseEnrollmentsContextProvider>
    </>
  );
};

export default (injectIntl(ProgramProgressPage));
