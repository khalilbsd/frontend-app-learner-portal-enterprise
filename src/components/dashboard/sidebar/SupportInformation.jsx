import React, { useContext } from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform/config';
import { MailtoLink, Hyperlink } from '@edx/paragon';

import PropTypes from 'prop-types';
import { SidebarBlock } from '../../layout';
import { CONTACT_HELP_EMAIL_MESSAGE, NEED_HELP_BLOCK_TITLE } from './data/constants';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from '../messages';

const SupportInformation = ({ className,intl }) => {
  const config = getConfig();
  const {
    enterpriseConfig: {
      adminUsers,
    },
  } = useContext(AppContext);

  const renderContactHelpText = () => {
    const message = intl.formatMessage(messages[CONTACT_HELP_EMAIL_MESSAGE]);
    const adminEmails = adminUsers.map(user => user.email);

    if (adminEmails.length > 0) {
      return (
        <MailtoLink to={"pro@groupado.com"}>
          {message}
        </MailtoLink>
      );
    }

    return message;
  };

  return (
    <SidebarBlock
      title={intl.formatMessage(messages[NEED_HELP_BLOCK_TITLE])}
      titleOptions={{ tag: 'h3' }}
      className={className}
    >
      <p>
        {intl.formatMessage(messages['support.technical.visit'])}{' '}
        <Hyperlink
          destination={"https://pro.groupado.com"}
          target="_blank"
          rel="noopener noreferrer"
        >
          {intl.formatMessage(messages['support.technical.help.center'])}
        </Hyperlink>.
      </p>
      <p>
        {intl.formatMessage(messages['support.technical.help.rquest'])}, {renderContactHelpText()}.
      </p>
    </SidebarBlock>
  );
};

SupportInformation.propTypes = {
  className: PropTypes.string,
  intl:intlShape.isRequired,
};

SupportInformation.defaultProps = {
  className: undefined,
};

export default (injectIntl(SupportInformation));
