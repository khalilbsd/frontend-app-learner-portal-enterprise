import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Dropdown, Badge, IconButton, Icon,
} from '@edx/paragon';
import camelCase from 'lodash.camelcase';
import { AppContext } from '@edx/frontend-platform/react';
import { sendEnterpriseTrackEvent } from '@edx/frontend-enterprise-utils';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform/config';
import { MoreVert } from '@edx/paragon/icons';
import Skeleton from 'react-loading-skeleton';

import { EmailSettingsModal } from './email-settings';
import { UnenrollModal } from './unenroll';
import { COURSE_STATUSES, COURSE_PACING } from '../../../../../constants';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../../../messages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import  cardMessages from './messages'


const BADGE_PROPS_BY_COURSE_STATUS = {
  [COURSE_STATUSES.inProgress]: {
    variant: 'success',
    children: 'In Progress',
  },
  [COURSE_STATUSES.upcoming]: {
    variant: 'primary',
    children: 'Upcoming',
  },
  [COURSE_STATUSES.requested]: {
    variant: 'secondary',
    children: 'Requested',
  },
};

class BaseCourseCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intl: this.props.intl,
      modals: {
        emailSettings: {
          open: false,
          options: {},
        },
        unenroll: {
          open: false,
          options: {},
        },
      },
      hasEmailsEnabled: this.props.hasEmailsEnabled,
    };
  }

  getDropdownMenuItems = () => {
    const {
      hasEmailsEnabled, title, dropdownMenuItems, canUnenroll,
    } = this.props;
    const firstMenuItems = [];
    const lastMenuItems = [];

    if (hasEmailsEnabled !== null) {
      firstMenuItems.push({
        key: 'email-settings',
        type: 'button',
        onClick: this.handleEmailSettingsButtonClick,
        children: (
          <div role="menuitem">
          {this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.email'])}
            <span className="sr-only">for {title}</span>
          </div>
        ),
      });
    }
    if (canUnenroll) {
      lastMenuItems.push({
        key: 'unenroll',
        type: 'button',
        onClick: this.handleUnenrollButtonClick,
        children: (
          <div role="menuitem">
            {this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.settings.unenroll'])}
            <span className="sr-only">from {title}</span>
          </div>
        ),
      });
    }
    if (dropdownMenuItems) {
      return [...firstMenuItems, ...dropdownMenuItems, ...lastMenuItems];
    }
    return [...firstMenuItems, ...lastMenuItems];
  };

  getDateMessage = () => {
    const { type, pacing, endDate } = this.props;
    const formattedEndDate = endDate ? moment(endDate).format('MMMM D, YYYY') : null;
    let message = '';
    if (formattedEndDate) {
      switch (type) {
        case COURSE_STATUSES.inProgress: {
          if (pacing === 'self') {
            message += `Complete at your own speed before ${formattedEndDate}.`;
          } else {
            message += `Ends ${formattedEndDate}.`;
          }
          break;
        }
        case COURSE_STATUSES.upcoming:
        case COURSE_STATUSES.completed:
        case COURSE_STATUSES.savedForLater: {
          const isCourseEnded = moment() > moment(endDate);
          message += isCourseEnded ? 'Ended' : 'Ends';
          message += ` ${formattedEndDate}.`;
          break;
        }
        default:
          break;
      }
    }
    return message;
  };

  getCourseMiscText = () => {
    const { pacing } = this.props;
    const isCourseEnded = this.isCourseEnded();
    const dateMessage = this.getDateMessage();
    let message = '';
    if (pacing) {
      message += this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.pace']);
      message += isCourseEnded ? this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.pace.was']) : this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.pace.is']);
      if (pacing === 'instructor' ){
        message += this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.pace.type.instructor'])
      }else {
        message += this.state.intl.formatMessage(messages['tab.courses.main.dashboard.course.pace.type.self'])

      }
    }
    if (dateMessage) {
      message += dateMessage;
    }
    return message;
  };

  setModalState = ({ key, open = false, options = {} }) => {
    this.setState(state => ({
      modals: {
        ...state.modals,
        [key]: {
          open,
          options,
        },
      },
    }));
  };

  isCourseEnded = () => {
    const { endDate } = this.props;
    return moment(endDate) < moment();
  };

  handleEmailSettingsButtonClick = () => {
    const { courseRunId } = this.props;
    const {
      hasEmailsEnabled,
    } = this.state;
    const { enterpriseConfig } = this.context;
    this.setModalState({
      key: 'emailSettings',
      open: true,
      options: {
        hasEmailsEnabled,
      },
    });
    sendEnterpriseTrackEvent(
      enterpriseConfig.uuid,
      'edx.ui.enterprise.learner_portal.email_settings_modal.opened',
      { course_run_id: courseRunId },
    );
  };

  handleEmailSettingsModalOnClose = (hasEmailsEnabled) => {
    this.resetModals();
    if (hasEmailsEnabled !== undefined) {
      this.setState({
        hasEmailsEnabled,
      });
    }
  };

  resetModals = () => {
    this.setModalState({ key: 'emailSettings' });
    this.setModalState({ key: 'unenroll' });
  };

  handleUnenrollButtonClick = () => {
    const { courseRunId } = this.props;
    const { enterpriseConfig } = this.context;
    this.setModalState({
      key: 'unenroll',
      open: true,
    });
    sendEnterpriseTrackEvent(
      enterpriseConfig.uuid,
      'edx.ui.enterprise.learner_portal.dashboard.enrollments.course.unenroll_modal.opened',
      { course_run_id: courseRunId },
    );
  };

  renderUnenrollModal = () => {
    const {
      canUnenroll, courseRunId, type,
    } = this.props;
    const { modals } = this.state;

    if (!canUnenroll) {
      return null;
    }

    return (
      <UnenrollModal
        courseRunId={courseRunId}
        onClose={this.handleUnenrollModalOnClose}
        onSuccess={this.handleUnenrollModalOnSuccess}
        isOpen={modals.unenroll.open}
        enrollmentType={camelCase(type)}
      />
    );
  };

  handleUnenrollModalOnClose = () => {
    this.resetModals();
    const { courseRunId } = this.props;
    const { enterpriseConfig } = this.context;
    sendEnterpriseTrackEvent(
      enterpriseConfig.uuid,
      'edx.ui.enterprise.learner_portal.dashboard.enrollments.course.unenroll_modal.closed',
      { course_run_id: courseRunId },
    );
  };

  handleUnenrollModalOnSuccess = () => {
    this.resetModals();
    const { courseRunId } = this.props;
    const { enterpriseConfig } = this.context;
    sendEnterpriseTrackEvent(
      enterpriseConfig.uuid,
      'edx.ui.enterprise.learner_portal.dashboard.enrollments.course.unenroll_modal.unenrolled',
      { course_run_id: courseRunId },
    );
  };

  renderSettingsDropdown = (menuItems) => {
    const { title } = this.props;
    if (menuItems && menuItems.length > 0) {
      return (
        <div className="ml-auto">
          <Dropdown>
            <Dropdown.Toggle
              as={IconButton}
              src={MoreVert}
              iconAs={Icon}
              alt={`course settings for ${title}`}
            />
            <Dropdown.Menu>
              {menuItems.map(menuItem => (
                <Dropdown.Item
                  key={menuItem.key}
                  as={menuItem.type}
                  onClick={menuItem.onClick}
                  role="menuitem"
                >
                  {menuItem.children}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      );
    }
    return null;
  };

  renderEmailSettingsModal = () => {
    const { hasEmailsEnabled, courseRunId } = this.props;
    const { modals } = this.state;
    if (hasEmailsEnabled !== null) {
      return (
        <EmailSettingsModal
          {...modals.emailSettings.options}
          courseRunId={courseRunId}
          onClose={this.handleEmailSettingsModalOnClose}
          open={modals.emailSettings.open}
        />
      );
    }
    return null;
  };

  renderAdditionalInfo = () => {
    const { enterpriseConfig: { name } } = this.context;
    const { type } = this.props;

    if (type === COURSE_STATUSES.requested) {
      return (
        <small>
          Please allow 5-10 business days for review.
          If approved, you will receive an email to get started.
        </small>
      );
    }

    if (name) {
      return <small>Sponsored by {name}.</small>;
    }

    return null;
  };

  renderMicroMastersTitle = () => {
    const { microMastersTitle } = this.props;
    if (microMastersTitle) {
      return (
        <p className="font-weight-bold w-75 mb-2">
          {microMastersTitle}
        </p>
      );
    }
    return null;
  };

  renderOrganizationName = () => {
    const { orgName } = this.props;
    if (orgName) {
      return <p className="mb-0">{orgName}</p>;
    }
    return null;
  };

  renderChildren = () => {
    const { children } = this.props;
    if (children) {
      return (
        <div className="row">
          <div className="col">
            {children}
          </div>
        </div>
      );
    }
    return null;
  };

  renderButtons = () => {
    const { buttons } = this.props;
    if (buttons) {
      return (
        <div className="row">
          <div className="col mb-3">
            {buttons}
          </div>
        </div>
      );
    }
    return null;
  };

  renderViewCertificateText = () => {
    const { linkToCertificate } = this.props;
    const user = getAuthenticatedUser();
    const { username } = user;
    const config = getConfig();

    if (linkToCertificate) {
      return (
        <small className="mb-0">
          {intl.formatMessage(cardMessages['course.cards.completed.view.certificate'])}

          <a  className='custom-link' href={`${config.LMS_BASE_URL}/u/${username}`}>
          {intl.formatMessage(cardMessages['course.cards.completed.view.certificate.profile'])}
              <FontAwesomeIcon className="ml-2 chevron-right" icon={faChevronRight} />
           </a>
        </small>
      );
    }
    return null;
  };

  render() {
    const {
      type,
      title,
      linkToCourse,
      hasViewCertificateLink,
      isLoading,

    } = this.props;
    const dropdownMenuItems = this.getDropdownMenuItems();
    return (
      <div className="dashboard-course-card py-4 border-bottom">
        {isLoading ? (
          <>
            <div className="sr-only">Loading...</div>
            <Skeleton height={50} />
          </>
        )
          : (
            <>
              <div className="d-flex">
                <div className="flex-grow-1 mr-4 mb-3">
                  {this.renderMicroMastersTitle()}
                  <div className="d-flex align-items-start justify-content-between mb-1">
                    <h4 className="course-title mb-0 mr-2">
                      <a className="h3" href={linkToCourse}>{title}</a>
                    </h4>
                    {
                      BADGE_PROPS_BY_COURSE_STATUS[type] && (
                        <Badge
                          className="mt-1"
                          {...BADGE_PROPS_BY_COURSE_STATUS[type]}
                        />
                      )
                    }
                  </div>
                  {this.renderOrganizationName()}
                </div>
                {this.renderSettingsDropdown(dropdownMenuItems)}
              </div>
              {this.renderButtons()}
              {this.renderChildren()}
              <div className="course-misc-text row">
                <div className="col text-gray">
                  <small className="mb-0">
                    {this.getCourseMiscText()}
                  </small>
                  {this.renderAdditionalInfo()}
                  {hasViewCertificateLink && this.renderViewCertificateText()}
                </div>
              </div>
              {this.renderEmailSettingsModal()}
              {this.renderUnenrollModal()}
            </>
          )}
      </div>
    );
  }
}

BaseCourseCard.propTypes = {
  type: PropTypes.oneOf(Object.values(COURSE_STATUSES)).isRequired,
  title: PropTypes.string.isRequired,
  linkToCourse: PropTypes.string.isRequired,
  courseRunId: PropTypes.string.isRequired,
  hasViewCertificateLink: PropTypes.bool,
  buttons: PropTypes.element,
  children: PropTypes.node,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  hasEmailsEnabled: PropTypes.bool,
  canUnenroll: PropTypes.bool,
  microMastersTitle: PropTypes.string,
  orgName: PropTypes.string,
  pacing: PropTypes.oneOf(Object.values(COURSE_PACING)),
  linkToCertificate: PropTypes.string,
  dropdownMenuItems: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.element,
  })),
  isLoading: PropTypes.bool,
};

BaseCourseCard.contextType = AppContext;

BaseCourseCard.defaultProps = {
  children: null,
  startDate: null,
  endDate: null,
  hasEmailsEnabled: null,
  canUnenroll: null,
  microMastersTitle: null,
  orgName: null,
  pacing: null,
  buttons: null,
  linkToCertificate: null,
  hasViewCertificateLink: true,
  dropdownMenuItems: null,
  isLoading: false,
};

export default (injectIntl(BaseCourseCard));
