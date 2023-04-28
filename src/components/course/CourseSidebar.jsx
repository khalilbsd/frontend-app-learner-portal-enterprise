import React, { useContext } from 'react';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import {
  faTachometerAlt,
  faTag,
  faUniversity,
  faGraduationCap,
  faCertificate,
  faFileVideo,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import ISO6391 from 'iso-639-1';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';

import { Hyperlink } from '@edx/paragon';
import { AppContext } from '@edx/frontend-platform/react';
import { CourseContext } from './CourseContextProvider';
import CourseSidebarListItem from './CourseSidebarListItem';
import CourseAssociatedPrograms from './CourseAssociatedPrograms';
import CourseSidebarPrice from './CourseSidebarPrice';

import { isDefinedAndNotNull, hasTruthyValue } from '../../utils/common';
import {
  useCourseSubjects,
  useCoursePartners,
  useCourseRunWeeksToComplete,
  useCourseTranscriptLanguages,
  useCoursePacingType,
} from './data/hooks';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

function CourseSidebar({intl}) {
  const { state } = useContext(CourseContext);
  const { course, activeCourseRun } = state;
  const { primarySubject } = useCourseSubjects(course);
  const [partners, institutionLabel] = useCoursePartners(course);
  const [weeksToComplete, weeksLabel] = useCourseRunWeeksToComplete(activeCourseRun,intl);
  const [transcriptLanguages, transcriptLabel] = useCourseTranscriptLanguages(activeCourseRun);
  const [pacingType, pacingTypeContent] = useCoursePacingType(activeCourseRun);
  const { enterpriseConfig } = useContext(AppContext);

  return (
    <>
      <ul className="pl-0 mb-5 course-details-sidebar">
        {isDefinedAndNotNull(activeCourseRun) && (
          <>
            {hasTruthyValue(activeCourseRun.weeksToComplete) && (
              <CourseSidebarListItem
                icon={faClock}
                label={isDefinedAndNotNull.formatMessage(messages['course.page.length'])}
                content={`${weeksToComplete} ${weeksLabel}`}
              />
            )}
            {hasTruthyValue([activeCourseRun.minEffort, activeCourseRun.maxEffort]) && (
              <CourseSidebarListItem
                icon={faTachometerAlt}
                label={intl.formatMessage(messages['course.page.effort'])}
                content={intl.formatMessage(messages['course.page.effort.hours'],{hoursPerWeek:activeCourseRun.minEffort-activeCourseRun.maxEffort})}
              />
            )}
          </>
        )}
        <CourseSidebarListItem
          icon={faTag}
          label={intl.formatMessage(messages['course.page.price'])}
          content={<CourseSidebarPrice />}
        />
        {partners?.length > 0 && (
          <CourseSidebarListItem
            icon={faUniversity}
            label={institutionLabel}
            content={partners.map(partner => (
              <span key={partner.key} className="d-block">
                <Hyperlink
                  destination={partner.marketingUrl}
                  target="_blank"
                  onClick={() => {
                    sendEnterpriseTrackEvent(
                      enterpriseConfig.uuid,
                      'edx.ui.enterprise.learner_portal.course.sidebar.partner.clicked',
                      {
                        partner_name: partner.key,
                      },
                    );
                  }}
                >
                  {partner.key}
                </Hyperlink>
              </span>
            ))}
          />
        )}
        {primarySubject && (
          <CourseSidebarListItem
            icon={faGraduationCap}
            label={intl.formatMessage(messages['course.page.subject'])}
            content={(
              <Hyperlink
                destination={primarySubject.url}
                target="_blank"
                onClick={() => {
                  sendEnterpriseTrackEvent(
                    enterpriseConfig.uuid,
                    'edx.ui.enterprise.learner_portal.course.sidebar.subject.clicked',
                    {
                      subject: primarySubject.name,
                    },
                  );
                }}
              >
                {primarySubject.name}
              </Hyperlink>
            )}
          />
        )}
        {activeCourseRun.levelType && (
          <CourseSidebarListItem
            icon={faCertificate}
            label={intl.formatMessage(messages['course.page.level'])}
            content={course.levelType}
          />
        )}
        {activeCourseRun.contentLanguage && (
          <CourseSidebarListItem
            icon={faUniversity}
            label={intl.formatMessage(messages['course.page.language'])}
            content={ISO6391.getNativeName(activeCourseRun.contentLanguage.slice(0, 2))}
          />
        )}
        {transcriptLanguages?.length > 0 && (
          <CourseSidebarListItem
            icon={faFileVideo}
            label={transcriptLabel}
            content={transcriptLanguages.map(language => (
              ISO6391.getNativeName(language.slice(0, 2))
            )).join(', ')}
          />
        )}
        {pacingType && (
          <CourseSidebarListItem
            icon={faUser}
            label={intl.formatMessage(messages['course.page.course.type'])}
            content={pacingTypeContent}
          />
        )}
      </ul>
      {course?.programs.length > 0 && (
        <CourseAssociatedPrograms />
      )}
      {course.prerequisitesRaw && (
        <div className="prerequisites mb-5">
          <h3>Prerequisites</h3>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: course.prerequisitesRaw }} />
        </div>
      )}
    </>
  );
}

export default (injectIntl(CourseSidebar))
