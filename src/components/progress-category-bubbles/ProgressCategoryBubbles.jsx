import React from 'react';
import { Bubble, Stack } from '@edx/paragon';
import PropTypes from 'prop-types';
import './styles/index.scss';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const ProgressCategoryBubbles = ({ notStarted, inProgress, completed,intl }) => (
  <Stack direction="horizontal" gap={3} className="programs-stats-stack">
      <div className="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.33 456.43L399 8.02C397.28 3.1 392.61 0 387.65 0c-3.01 0-4.97 1.03-11.49 3.31-6.46 2.26-9.82 8.24-6.27 18.38-16.46 9.69-59.15 24.09-75.5 26.42-1.33-3.78-1.97-6.62-6.4-9.23V32c0-17.67-14.33-32-32-32h-96c-5.96 0-11.22 2.07-16 4.9C139.22 2.07 133.96 0 128 0H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h96c5.96 0 11.22-2.07 16-4.9 4.78 2.84 10.04 4.9 16 4.9h96c17.67 0 32-14.33 32-32V118.88l151.43 385.1c1.73 4.92 6.4 8.02 11.35 8.02 3 0 4.96-1.03 11.49-3.31 6.44-2.25 9.83-8.23 6.27-18.38 16.46-9.69 59.15-24.09 75.5-26.42 3.65 10.4 10.13 12.65 16.38 10.46l7.55-2.64c6.23-2.19 9.54-9.07 7.36-15.28zM128 480H32v-64h96v64zm0-96H32V128h96v256zm0-288H32V32h96v64zm128 384h-96v-64h96v64zm0-96h-96V128h96v256zm0-288h-96V32h96v64zm203.15 367.54L303.79 74.88c25.22-4.74 64.01-20.33 75.5-26.42l155.36 388.65c-25.23 4.75-64.01 20.33-75.5 26.43z"/></svg>
      </div>
    <div className='program-stats-bubbles'> {notStarted} {intl.formatMessage(messages['tab.programs.list.program.card.status.bubble.remaining'])}</div>

    <div className="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.33 456.43L399 8.02C397.28 3.1 392.61 0 387.65 0c-3.01 0-4.97 1.03-11.49 3.31-6.46 2.26-9.82 8.24-6.27 18.38-16.46 9.69-59.15 24.09-75.5 26.42-1.33-3.78-1.97-6.62-6.4-9.23V32c0-17.67-14.33-32-32-32h-96c-5.96 0-11.22 2.07-16 4.9C139.22 2.07 133.96 0 128 0H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h96c5.96 0 11.22-2.07 16-4.9 4.78 2.84 10.04 4.9 16 4.9h96c17.67 0 32-14.33 32-32V118.88l151.43 385.1c1.73 4.92 6.4 8.02 11.35 8.02 3 0 4.96-1.03 11.49-3.31 6.44-2.25 9.83-8.23 6.27-18.38 16.46-9.69 59.15-24.09 75.5-26.42 3.65 10.4 10.13 12.65 16.38 10.46l7.55-2.64c6.23-2.19 9.54-9.07 7.36-15.28zM128 480H32v-64h96v64zm0-96H32V128h96v256zm0-288H32V32h96v64zm128 384h-96v-64h96v64zm0-96h-96V128h96v256zm0-288h-96V32h96v64zm203.15 367.54L303.79 74.88c25.22-4.74 64.01-20.33 75.5-26.42l155.36 388.65c-25.23 4.75-64.01 20.33-75.5 26.43z"/></svg>
      </div>


    <div className='program-stats-bubbles'>  {inProgress} {intl.formatMessage(messages['tab.programs.list.program.card.status.bubble.progress'])}</div>

    <div className="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.33 456.43L399 8.02C397.28 3.1 392.61 0 387.65 0c-3.01 0-4.97 1.03-11.49 3.31-6.46 2.26-9.82 8.24-6.27 18.38-16.46 9.69-59.15 24.09-75.5 26.42-1.33-3.78-1.97-6.62-6.4-9.23V32c0-17.67-14.33-32-32-32h-96c-5.96 0-11.22 2.07-16 4.9C139.22 2.07 133.96 0 128 0H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h96c5.96 0 11.22-2.07 16-4.9 4.78 2.84 10.04 4.9 16 4.9h96c17.67 0 32-14.33 32-32V118.88l151.43 385.1c1.73 4.92 6.4 8.02 11.35 8.02 3 0 4.96-1.03 11.49-3.31 6.44-2.25 9.83-8.23 6.27-18.38 16.46-9.69 59.15-24.09 75.5-26.42 3.65 10.4 10.13 12.65 16.38 10.46l7.55-2.64c6.23-2.19 9.54-9.07 7.36-15.28zM128 480H32v-64h96v64zm0-96H32V128h96v256zm0-288H32V32h96v64zm128 384h-96v-64h96v64zm0-96h-96V128h96v256zm0-288h-96V32h96v64zm203.15 367.54L303.79 74.88c25.22-4.74 64.01-20.33 75.5-26.42l155.36 388.65c-25.23 4.75-64.01 20.33-75.5 26.43z"/></svg>
      </div>


    <div className='program-stats-bubbles'>{completed} {intl.formatMessage(messages['tab.programs.list.program.card.status.bubble.completed'])}</div>
  </Stack>
);

ProgressCategoryBubbles.propTypes = {
  notStarted: PropTypes.number.isRequired,
  inProgress: PropTypes.number.isRequired,
  completed: PropTypes.number.isRequired,
};

export default (injectIntl(ProgressCategoryBubbles));
