import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { StatusAlert } from '@edx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchMinus } from '@fortawesome/free-solid-svg-icons';

import { PopularResults } from './popular-results';
import { getNoResultsMessage } from '../utils/search';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const SearchNoResults = ({ title,intl}) => {
  const noResultsMessage = getNoResultsMessage(title);
  const lowerCaseTitle = title.toLowerCase();
  const renderDialog = useCallback(
    () => (
      <div className="lead d-flex align-items-center py-3">
        <div className="mr-3">
          <FontAwesomeIcon icon={faSearchMinus} size="2x" />
        </div>
        <div>
        {intl.formatMessage(messages[noResultsMessage.messageTitle],{lowerCaseTitle})}

          <br />
        {intl.formatMessage(messages[noResultsMessage.messageContent],{lowerCaseTitle})}
        </div>
      </div>
    ),
    [noResultsMessage.messageContent, noResultsMessage.messageTitle],
  );

  // TODO: Design Debt. Replace with `Alert` from @edx/paragon.
  return (
    <>
      <StatusAlert
        className="mb-5"
        alertType="info"
        dialog={renderDialog()}
        dismissible={false}
        open
      />
      <PopularResults title={title} />
    </>
  );
};

SearchNoResults.propTypes = {
  title: PropTypes.string.isRequired,
};

export default (injectIntl(SearchNoResults));
