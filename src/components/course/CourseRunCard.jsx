import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import {
  Card,
} from '@edx/paragon';

import { AppContext } from '@edx/frontend-platform/react';
import { useLocation } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform/config';
import EnrollAction from './enrollment/EnrollAction';
import { enrollButtonTypes } from './enrollment/constants';
import {
  COURSE_AVAILABILITY_MAP,
  LICENSE_SUBSIDY_TYPE,
} from './data/constants';
import {
  isUserEntitledForCourse,
  isCourseSelfPaced,
  hasTimeToComplete,
  isArchived,
  findUserEnrollmentForCourseRun,
  hasCourseStarted,
  findHighestLevelSeatSku,
  numberWithPrecision,
} from './data/utils';
import { formatStringAsNumber } from '../../utils/common';
import { isExperimentVariant } from '../../utils/optimizely';

import { useSubsidyDataForCourse } from './enrollment/hooks';
import { useCourseEnrollmentUrl, useUserHasSubsidyRequestForCourse, useCoursePriceForUserSubsidy } from './data/hooks';
import { determineEnrollmentType } from './enrollment/utils';
import { SubsidyRequestsContext } from '../enterprise-subsidy-requests/SubsidyRequestsContextProvider';
import { getLocale, injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const DATE_FORMAT = 'MMM D';
const DEFAULT_BUTTON_LABEL = 'course.page.header.courseruns.enroll';

const LicenseSubsidyPriceText = ({
  courseRun,
  userSubsidyApplicableToCourse,
  intl
}) => {
  const [coursePrice, currency] = useCoursePriceForUserSubsidy({
    activeCourseRun: courseRun, userSubsidyApplicableToCourse,
  });

  return (
    <>
      <div className="mt-2" data-testid="subsidy-license-price-text">
        <del>
          <span className="sr-only">{intl.formatMessage(messages['course.page.header.courseruns.card.reduced'])}</span>${numberWithPrecision(coursePrice.list)} {currency}
        </del>
        <span>{intl.formatMessage(messages['course.page.header.courseruns.card.reduced.included'])}</span>
      </div>
    </>
  );
};

const CourseRunCard = ({
  userEntitlements,
  courseRun,
  userEnrollments,
  courseKey,
  subsidyRequestCatalogsApplicableToCourse,
  intl
}) => {
  const {
    availability,
    pacingType,
    courseUuid,
    enrollmentCount,
    start,
    key,
    seats,
    isEnrollable,
  } = courseRun;

  const config = getConfig();

  const location = useLocation();

  const { enterpriseConfig } = useContext(AppContext);

  const isCourseStarted = useMemo(
    () => hasCourseStarted(start),
    [start],
  );

  const userEnrollment = useMemo(
    () => findUserEnrollmentForCourseRun({ userEnrollments, key }),
    [userEnrollments, key],
  );

  const { subsidyRequestConfiguration } = useContext(SubsidyRequestsContext);
  const userHasSubsidyRequestForCourse = useUserHasSubsidyRequestForCourse(courseKey);

  const isUserEnrolled = !!userEnrollment;

  const {
    subscriptionLicense,
    userSubsidyApplicableToCourse,
    hasCouponCodeForCourse,
  } = useSubsidyDataForCourse();

  const sku = useMemo(
    () => findHighestLevelSeatSku(seats),
    [seats],
  );
  const enrollmentUrl = useCourseEnrollmentUrl({
    enterpriseConfig,
    key,
    courseRunKey: key,
    location,
    sku,
    subscriptionLicense,
    userSubsidyApplicableToCourse,
  });

  const enrollmentType = determineEnrollmentType({
    subsidyData: {
      subscriptionLicense,
      userSubsidyApplicableToCourse,
      enrollmentUrl,
      hasCouponCodeForCourse,
      subsidyRequestConfiguration,
    },
    userHasSubsidyRequestForCourse,
    subsidyRequestCatalogsApplicableToCourse,
    isUserEnrolled,
    isEnrollable,
    isCourseStarted,
  });

  const courseRunArchived = isArchived(courseRun);
  /**
   * Updates to this function should be reflected in docs:
   * see /docs/images/enroll_button_card_generator.rst
   * Generates three string labels used on course run header card
   * heading, subHeading, buttonLabel
   * |¯¯¯¯¯¯¯¯¯¯¯¯¯|
   * |   heading   |
   * |  subHeading |
   * ||¯¯¯¯¯¯¯¯¯¯¯||
   * ||buttonLabel||
   * ||___________||
   * |_____________|
   * @returns {string []}
   */
  const [heading, subHeading, buttonLabel] = useMemo(() => {
    if (courseRunArchived) {
      return [
        intl.formatMessage(messages['course.page.header.courseruns.card.archived']),
        intl.formatMessage(messages['course.page.header.courseruns.card.archived.to.annouced']),
      ];
    }

    if (!isEnrollable) {
      if (
        (availability === COURSE_AVAILABILITY_MAP.UPCOMING || availability === COURSE_AVAILABILITY_MAP.STARTING_SOON)
        && start
      ) {
        // Course will be available in the future
        return [
          intl.formatMessage(messages['course.page.header.courseruns.card.archived.coming.soon']),
          // `Enroll after ${moment(start).format(DATE_FORMAT)}`,
          intl.formatMessage(messages['course.page.header.courseruns.card.archived.coming.soon.after'], { SOON: (new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(start) }),
          intl.formatMessage(messages[DEFAULT_BUTTON_LABEL]),
        ];
      }
      // Course no future date availability announced
      return [
        intl.formatMessage(messages['course.page.header.courseruns.card.enrollment.closed']),
        intl.formatMessage(messages['course.page.header.courseruns.card.archived.to.annouced']),
        intl.formatMessage(messages[DEFAULT_BUTTON_LABEL]),
      ];
    }

    if (isUserEnrolled) {
      // User is enrolled
      return [
        !isCourseStarted

          ? intl.formatMessage(messages['course.page.header.courseruns.card.will.start'], { starts_in: (new Intl.DateTimeFormat(getLocale(), { weekday: 'long', month: 'short', day: 'numeric' })).format(start) })
          : intl.formatMessage(messages['course.page.header.courseruns.started']),
        intl.formatMessage(messages['course.page.header.courseruns.enrolled']),
        intl.formatMessage(messages['course.page.header.courseruns.enrolled.view']),

      ];
    }
    // User is not enrolled
    if (isUserEntitledForCourse({ userEntitlements, courseUuid })) {
      // Is entitled for course
      return [
        intl.formatMessage(messages['course.page.header.courseruns.entitlment']),
        '',
       intl.formatMessage(messages['course.page.header.courseruns.entitlment.view.dashbaord']),
      ];
    }
    const tempSubHeading = enrollmentCount > 0

      ? intl.formatMessage(messages['course.page.header.courseruns.enrollment.count'],{enrollmentCount:formatStringAsNumber(enrollmentCount)})
      :  intl.formatMessage(messages['course.page.header.courseruns.enrollment.count.first']);

    let tempHeading = `${isCourseStarted ? intl.formatMessage(messages['course.page.header.courseruns.started']) : intl.formatMessage(messages['course.page.header.courseruns.starts'])} ${start}}`

    if (isCourseSelfPaced(pacingType)) {
      if (isCourseStarted) {
        tempHeading = hasTimeToComplete(courseRun) ? `${intl.formatMessage(messages['course.page.header.courseruns.starts'])} ${moment().format(DATE_FORMAT)}` : intl.formatMessage(messages['course.page.header.courseruns.course.started']);
      }
    }
    return [
      tempHeading,
      tempSubHeading,
      intl.formatMessage(messages[DEFAULT_BUTTON_LABEL]),
    ];
  }, [
    courseRunArchived,
    isEnrollable,
    isUserEnrolled,
    userEntitlements,
    courseUuid,
    enrollmentCount,
    isCourseStarted,
    start,
    pacingType,
    availability,
    courseRun,
  ]);

  const shouldShowLicenseSubsidyPriceText = (
    !courseRunArchived
    && !enterpriseConfig.hideCourseOriginalPrice
    && enrollmentType === enrollButtonTypes.TO_DATASHARING_CONSENT
    && userSubsidyApplicableToCourse?.subsidyType === LICENSE_SUBSIDY_TYPE
  );
  // Only users buckted in `Variation 1` can see the change.
  const isExperimentVariation1 = isExperimentVariant(config.EXPERIMENT_2_ID, config.EXPERIMENT_2_VARIANT_1_ID);
  // For our experiment, we should trigger our Optimizely event only when this condition is true
  const triggerLicenseSubsidyEvent = shouldShowLicenseSubsidyPriceText;

  return (
    <Card className="w-100">
      <Card.Section
        className="d-flex flex-column align-items-center justify-content-between"
      >
        <div className={classNames(
          'text-center',
          {
            'mb-3.5': enrollmentType !== enrollButtonTypes.HIDE_BUTTON,
          },
        )}
        >
          <div className="h4 mb-0">{heading}</div>
          <div className="small">{subHeading}</div>
          {isExperimentVariation1 && shouldShowLicenseSubsidyPriceText && (
            <LicenseSubsidyPriceText
              courseRun={courseRun}
              intl={intl}
              userSubsidyApplicableToCourse={userSubsidyApplicableToCourse}
            />
          )}
        </div>
        {!courseRunArchived && (
          <EnrollAction
            enrollLabel={buttonLabel}
            enrollmentType={enrollmentType}
            enrollmentUrl={enrollmentUrl}
            userEnrollment={userEnrollment}
            subscriptionLicense={subscriptionLicense}
            triggerLicenseSubsidyEvent={triggerLicenseSubsidyEvent}
            courseRunPrice={courseRun.firstEnrollablePaidSeatPrice}
          />
        )}
      </Card.Section>
    </Card>
  );
};

CourseRunCard.propTypes = {
  courseKey: PropTypes.string.isRequired,
  courseRun: PropTypes.shape({
    availability: PropTypes.string.isRequired,
    isEnrollable: PropTypes.bool.isRequired,
    pacingType: PropTypes.string.isRequired,
    courseUuid: PropTypes.string.isRequired,
    enrollmentCount: PropTypes.number,
    start: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    seats: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    firstEnrollablePaidSeatPrice: PropTypes.number.isRequired,
  }).isRequired,
  userEnrollments: PropTypes.arrayOf(PropTypes.shape({
    isEnrollmentActive: PropTypes.bool.isRequired,
    isRevoked: PropTypes.bool.isRequired,
    courseRunId: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
  })).isRequired,
  userEntitlements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  subsidyRequestCatalogsApplicableToCourse: PropTypes.instanceOf(Set).isRequired,
};

LicenseSubsidyPriceText.propTypes = {
  courseRun: PropTypes.shape({
    availability: PropTypes.string.isRequired,
    isEnrollable: PropTypes.bool.isRequired,
    pacingType: PropTypes.string.isRequired,
    courseUuid: PropTypes.string.isRequired,
    enrollmentCount: PropTypes.number,
    start: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    seats: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    firstEnrollablePaidSeatPrice: PropTypes.number.isRequired,
  }).isRequired,
  userSubsidyApplicableToCourse: PropTypes.shape({
    discountType: PropTypes.string.isRequired,
    discountValue: PropTypes.number.isRequired,
    expirationDate: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    subsidyId: PropTypes.string.isRequired,
  }).isRequired,
};

export default (injectIntl(CourseRunCard));
