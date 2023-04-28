import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connectStateResults, Hits } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';
import {
  useNbHitsFromSearchResults, SearchContext, SearchPagination, setRefinementAction,
} from '@edx/frontend-enterprise-catalog-search';
import { Container, Row } from '@edx/paragon';

import SearchNoResults from './SearchNoResults';
import SearchError from './SearchError';

import { isDefinedAndNotNull } from '../../utils/common';
import {
  CONTENT_TYPE_PATHWAY,
  PROGRAM_TITLE,
} from './constants';
import { getContentTypeFromTitle, getNoOfResultsFromTitle, getSkeletonCardFromTitle } from '../utils/search';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const SearchResults = ({
  searchResults,
  searchState,
  isSearchStalled,
  error,
  hitComponent,
  title,
  contentType,
  intl
}) => {
  const { refinements, dispatch } = useContext(SearchContext);
  const nbHits = useNbHitsFromSearchResults(searchResults);
  const linkText = `Show (${nbHits})`;


  console.log(nbHits)
  // To prevent from showing same error twice, we only render the StatusAlert when course results are zero */
  const showMessage = (type, heading) => {
    if (isDefinedAndNotNull(type)) {
      return true;
    }
    if (!isDefinedAndNotNull(type) && heading === PROGRAM_TITLE) {
      return false;
    }
    return true;
  };

  const clickHandler = () => {
    dispatch(setRefinementAction('content_type', [getContentTypeFromTitle(title)]));
  };

  const query = useMemo(
    () => {
      if (refinements.q) {
        return refinements.q;
      }
      return searchState?.query;
    },
    [refinements.q, searchState.query],
  );

  const page = useMemo(
    () => {
      if (refinements.page) {
        return refinements.page;
      }
      return searchState?.page;
    },
    [refinements.page, searchState.page],
  );

  const resultsHeading = useMemo(
    () => {
      const resultsLabel = nbHits === 0 || nbHits > 1 ? intl.formatMessage(messages['search.found.message.results']) : intl.formatMessage(messages['search.found.message.result']);
      return (
        <>
          {title} ({nbHits} {resultsLabel})
          {query && <>{' '}for &quot;{query}&quot;</>}
          <hr />
        </>
      );
    },
    [nbHits, query, title],
  );

  return (
    <Container size="lg" className="search-results my-5">
      <>
        <div className="d-flex align-items-center mb-2">
          <h2 className="flex-grow-1 mb-2 result-heading">
            {isSearchStalled && (
              <Skeleton className="h2 d-block mb-3" width={240} />
            )}

            {!isSearchStalled && nbHits > 0 && (
              <>  {resultsHeading}  </>
            )}

          </h2>
          {(!isSearchStalled && nbHits > 0) && (contentType !== undefined) && (
            <SearchPagination
              defaultRefinement={page}
              maxPagesDisplayed={5}
            />
          )}
          {(!isSearchStalled && nbHits > 0) && (contentType === undefined) && (
            <button
              onClick={clickHandler}
              className="show-all-link btn btn-link muted-link inline-link d-inline-block pl-0 pr-4 px-xl-0"
              type="button"
            >
              {linkText} <i class="fa fa-chevron-right" aria-hidden="true"></i>

            </button>
          )}
        </div>
        {isSearchStalled && (
          <>
            <Skeleton className="lead mb-4" width={160} />
            <Row>
              {[...Array(getNoOfResultsFromTitle(title)).keys()].map(resultNum => (
                <div key={resultNum} className="skeleton-course-card">
                  {getSkeletonCardFromTitle(title)}
                </div>
              ))}
            </Row>
          </>
        )}
        {!isSearchStalled && nbHits > 0 && (
          <>
            <Hits hitComponent={hitComponent} />
            {(contentType !== undefined) && (
              <div className="d-flex justify-content-center">
                <SearchPagination defaultRefinement={page} />
              </div>
            )}
          </>
        )}
        {!isSearchStalled && nbHits === 0 && getContentTypeFromTitle(title) !== CONTENT_TYPE_PATHWAY && (
          <>

          <SearchNoResults title={title} />
        </>
        )}
        {!isSearchStalled && isDefinedAndNotNull(error) && showMessage(contentType, title) && (
          <SearchError title={title} />
        )}
      </>
    </Container>
  );
};

SearchResults.propTypes = {
  searchState: PropTypes.shape({
    query: PropTypes.string,
    page: PropTypes.number,
  }).isRequired,
  searchResults: PropTypes.shape({
    nbHits: PropTypes.number,
  }),
  isSearchStalled: PropTypes.bool,
  error: PropTypes.shape(),
  contentType: PropTypes.string,
  hitComponent: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
};

SearchResults.defaultProps = {
  searchResults: undefined,
  isSearchStalled: false,
  error: undefined,
  contentType: undefined,
};

export default connectStateResults(injectIntl(SearchResults));
