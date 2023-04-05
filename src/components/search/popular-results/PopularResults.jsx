import React from 'react';
import PropTypes from 'prop-types';
import { Hits, connectStateResults } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';

import { useNbHitsFromSearchResults } from '@edx/frontend-enterprise-catalog-search';
import SearchError from '../SearchError';

import { isDefinedAndNotNull } from '../../../utils/common';
import { NUM_RESULTS_TO_DISPLAY } from './data/constants';
import { getHitComponentFromTitle, getSkeletonCardFromTitle } from '../../utils/search';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';

const PopularResults = ({
  searchResults,
  isSearchStalled,
  error,
  title,
  numberResultsToDisplay,
  inlt
}) => {
  const nbHits = useNbHitsFromSearchResults(searchResults);

  return (
    <>
      <h2 className="mb-4">
        {isSearchStalled && (
          <Skeleton className="h2 d-block mb-3" width={240} />
        )}
      </h2>
      {isSearchStalled && (
        <div className="row">
          {[...Array(numberResultsToDisplay).keys()].map(resultNum => (
            <div key={resultNum} className="skeleton-course-card">
              {getSkeletonCardFromTitle(title)}
            </div>
          ))}
        </div>
      )}
      {!isSearchStalled && nbHits > 0 && (
        <>
          <h2>

            {Intl.formatMessage(messages['content.type.title.popular'])}
          </h2>
          <Hits hitComponent={getHitComponentFromTitle(title)} />
        </>
      )}
      {!isSearchStalled && isDefinedAndNotNull(error) && (
        <SearchError />
      )}
    </>
  );
};

PopularResults.propTypes = {
  searchResults: PropTypes.shape(),
  isSearchStalled: PropTypes.bool,
  error: PropTypes.shape(),
  title: PropTypes.string.isRequired,
  numberResultsToDisplay: PropTypes.number,
};

PopularResults.defaultProps = {
  searchResults: undefined,
  isSearchStalled: false,
  error: undefined,
  numberResultsToDisplay: NUM_RESULTS_TO_DISPLAY,
};

export default connectStateResults(injectIntl(PopularResults));
