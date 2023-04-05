import React from 'react';
import PropTypes from 'prop-types';
import { Configure, Index } from 'react-instantsearch-dom';
import { getConfig } from '@edx/frontend-platform/config';

import { NUM_RESULTS_PROGRAM, CONTENT_TYPE_PROGRAM, PROGRAM_TITLE } from './constants';
import SearchResults from './SearchResults';
import SearchProgramCard from './SearchProgramCard';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const SearchProgram = ({ filter,intl }) => {
  const defaultFilter = `content_type:${CONTENT_TYPE_PROGRAM} AND ${filter}`;
  const config = getConfig();

  return (
    <Index indexName={config.ALGOLIA_INDEX_NAME} indexId="search-programs">
      <Configure
        hitsPerPage={NUM_RESULTS_PROGRAM}
        filters={defaultFilter}
        clickAnalytics
      />
      <SearchResults hitComponent={SearchProgramCard} title={intl.formatMessage(messages[PROGRAM_TITLE])} />
    </Index>
  );
};

SearchProgram.propTypes = {
  filter: PropTypes.string.isRequired,
};

export default (injectIntl(SearchProgram));
