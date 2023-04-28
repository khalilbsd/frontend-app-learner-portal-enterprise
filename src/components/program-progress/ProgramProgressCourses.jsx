import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Col, Row,
} from '@edx/paragon';
import moment from 'moment';
import { CheckCircle } from '@edx/paragon/icons';
import { AppContext } from '@edx/frontend-platform/react';

import { UserSubsidyContext } from '../enterprise-user-subsidy';
import { SubsidyRequestsContext } from '../enterprise-subsidy-requests';
import {
  courseUpgradationAvailable,
  getCertificatePriceString,
  getEnrolledCourseRunDetails,
  getNotStartedCourseDetails,
  hasLicenseOrCoupon,
} from './data/utils';
import { NotCurrentlyAvailable } from './data/constants';
import { getLocale, injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const ProgramProgressCourses = ({ courseData, intl }) => {
  const { enterpriseConfig } = useContext(AppContext);
  const {
    subscriptionPlan,
    subscriptionLicense,
    couponCodes: { couponCodesCount },
  } = useContext(UserSubsidyContext);

  const { requestsBySubsidyType } = useContext(SubsidyRequestsContext);

  const userHasLicenseOrCoupon = hasLicenseOrCoupon({
    requestsBySubsidyType,
    subscriptionPlan,
    subscriptionLicense,
    couponCodesCount,
  });

  let coursesCompleted = [];
  let coursesInProgress = [];
  let coursesNotStarted = [];
  const courseAboutPageURL = (key) => `/enterprise_learner/${enterpriseConfig.slug}/course/${key}`;
  const courseSponserdByEnterprise = `Sponsored by ${enterpriseConfig.name}`;

  if (courseData?.completed) {
    coursesCompleted = getEnrolledCourseRunDetails(courseData.completed);
  }
  if (courseData?.inProgress) {
    coursesInProgress = getEnrolledCourseRunDetails(courseData.inProgress);
  }
  if (courseData?.notStarted) {
    coursesNotStarted = getNotStartedCourseDetails(courseData.notStarted);
  }
  const { courseWithMultipleCourseRun, courseWithSingleCourseRun } = coursesNotStarted;

  const getCertificatePrice = (course) => {
    const certificatePrice = getCertificatePriceString(course);
    if (userHasLicenseOrCoupon) {
      return (
        <>
          {certificatePrice
            && (
              <del>
                <span className="text-success-500 pr-1.5 pl-1.5"> {certificatePrice}</span>
              </del>
            )}
          {courseSponserdByEnterprise}
        </>
      );
    }
    return (
      <>
        <span className="pl-2">{intl.formatMessage(messages['program.progress.page.certificate.needs'])} </span>
        <span className="text-success-500 pl-2">{certificatePrice}</span>
      </>
    );
  };

  const renderCertificatePurchased = () => (
    <Row className="d-flex align-items-start py-3 pt-5">
      <Col className="d-flex align-items-center">
        <span>{intl.formatMessage(messages['program.progress.page.certificate.status'])} </span>
        <CheckCircle className="fa fa-check-circle circle-color pl-1" />
        <span className="pl-1">{intl.formatMessage(messages['program.progress.page.certificate.purchased'])}</span>
      </Col>
    </Row>
  );

  const renderCertificatePriceMessage = (course) => (
    <>
      <Row className="d-flex align-items-start py-3 pt-5 add-between-space">
        <Col className="d-flex align-items-center">
          <span>{intl.formatMessage(messages['program.progress.page.certificate.status'])} </span>
          {getCertificatePrice(course)}
        </Col>
      </Row>
      <a
        className="btn btn-outline-primary btn-xs-block float-right mb-2 pt-2"
        href={courseAboutPageURL(course.key)}
      >
        {intl.formatMessage(messages['program.progress.page.certificate.upgrade.veirified'])}
      </a>
    </>
  );

  return (
    <div className="col-10 p-0">
      {coursesInProgress?.length > 0
        && (
          <div className="mb-5">
            <h4 className="white-space-pre">{intl.formatMessage(messages['program.progress.page.courses.progress'])}    {coursesInProgress.length}</h4>
            <hr />
            <div className="courses">
              {coursesInProgress.map((course) => (
                (
                  <div className="mt-2.5 pt-2 pl-3 pb-5.5 pr-3" key={course.key}>
                    <h4 className="text-dark-500">{course.title}</h4>
                    <p className="text-gray-500 text-capitalize mt-1">{intl.formatMessage(messages['program.progress.page.courses.enrolled'])}
                      ({course?.pacingType.replace('_', '-')}) {intl.formatMessage(messages['program.progress.page.courses.enrolled.started'])}

                      {(new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(new Date(course.start))}

                    </p>
                    <a
                      className="btn btn-outline-primary btn-xs-block float-right mb-4 mt-4"
                      href={courseAboutPageURL(course.key)}
                    >
                      {course.isEnded ? intl.formatMessage(messages['program.progress.page.courses.enrolled.view']) : intl.formatMessage(messages['program.progress.page.courses.enrolled.view.archived'])}
                    </a>
                    {course.certificateUrl
                      ? renderCertificatePurchased()
                      : courseUpgradationAvailable(course)
                      && renderCertificatePriceMessage(course)}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      {courseData?.notStarted?.length > 0
        && (
          <div className="mb-5 courses">
            <h4 className="white-space-pre"> {intl.formatMessage(messages['program.progress.page.courses.remaining'])}   {courseData?.notStarted?.length}</h4>
            <hr />
            {courseWithSingleCourseRun.map((course) => (
              (
                <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                  <h4 className="text-dark-500">{course.title}</h4>
                  {course.isEnrollable
                    ? (
                      <>
                        <p className="text-gray-500 text-capitalize mt-1">


                          ({course?.pacingType.replace('_', '-')}) {intl.formatMessage(messages['program.progress.page.courses.remaining.startes'])}

                          {(new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(new Date(course.start))}
                        </p>
                        <a
                          className="btn btn-outline-primary btn-xs-block mt-2 float-right"
                          href={courseAboutPageURL(course.key)}
                        >
                          {intl.formatMessage(messages['program.progress.page.courses.remaining.enroll'])}
                        </a>
                      </>
                    )
                    : (
                      <p
                        className=" mt-2 float-right"
                      >
                        {NotCurrentlyAvailable}
                      </p>
                    )}
                </div>
              )
            ))}

            {courseWithMultipleCourseRun.map((course) => (
              (
                <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                  <h4 className="text-dark-500">{course.title}</h4>
                  {course.isEnrollable
                    ? (
                      <>
                        <p className="text-gray-500 text-capitalize mt-1">
                          {course.courseRunDate?.length > 1
                            ? (
                              <Form.Group className="pr-0" as={Col} controlId="formGridState-2">
                                <Form.Label>{intl.formatMessage(messages['rogram.progress.page.courses.sessions.availaible'])}</Form.Label>
                                <Form.Control as="select">
                                  {course.courseRunDate.map(cRunDate => (
                                    <option>{cRunDate}</option>
                                  ))}
                                </Form.Control>
                              </Form.Group>
                            )
                            : (
                              <span data-testid="course-run-single-date">
                                ({course?.pacingType.replace('_', '-')}) {intl.formatMessage(messages['program.progress.page.courses.remaining.startes'])}
                                {(new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(new Date(course.start))}
                              </span>
                            )}
                        </p>
                        <a
                          className="btn btn-outline-primary btn-xs-block mt-2 float-right"
                          href={courseAboutPageURL(course.key)}
                        >
                          {intl.formatMessage(messages['program.progress.page.courses.sessions.availaible.learnmore'])}
                        </a>
                      </>
                    )
                    : (
                      <p className="mt-2 float-right">
                        {NotCurrentlyAvailable}
                      </p>
                    )}
                </div>
              )
            ))}
          </div>
        )}
      {coursesCompleted?.length > 0
        && (
          <div className="mb-6 courses">
            <h4 className="white-space-pre"> COURSES COMPLETED    {coursesCompleted.length}</h4>
            <hr />
            {coursesCompleted.map((course) => (
              (
                <div className="mt-4.5 pl-3 pb-5 pr-3" key={course.key}>
                  <h4 className="text-dark-500">{course.title}</h4>
                  <p className="text-gray-500 text-capitalize mt-1">
                    ({course?.pacingType.replace('_', '-')})
                    {intl.formatMessage(messages['program.progress.page.courses.enrolled.started'])}
                    {(new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(new Date(course.start))}
                  </p>
                  <a
                    className="btn btn-outline-primary btn-xs-block mb-6 float-right"
                    href={courseAboutPageURL(course.key)}
                  >
                   intl.formatMessage(messages['program.progress.page.courses.enrolled.view'])
                  </a>

                  {course.certificateUrl ? renderCertificatePurchased()
                    : courseUpgradationAvailable(course)
                    && renderCertificatePriceMessage(course)}
                </div>
              )
            ))}
          </div>
        )}
    </div>

  );
};
ProgramProgressCourses.propTypes = {
  courseData: PropTypes.shape([]).isRequired,
};
export default (injectIntl(ProgramProgressCourses));
