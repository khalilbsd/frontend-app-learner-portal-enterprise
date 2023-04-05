import React, { useContext } from 'react';
import { Button } from '@edx/paragon';

import { AppContext } from '@edx/frontend-platform/react';
import { Link } from 'react-router-dom';

import SkillsQuizImage from '../../../assets/images/skills-quiz/skills-quiz.png';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from '../messages';

const CourseRecommendations = ({intl}) => {
  const {
    enterpriseConfig: {
      slug,
    },
  } = useContext(AppContext);

  return (
    <div className="course-recommendations">
      <h2 className="course-recommendations-title">{intl.formatMessage(messages['tab.courses.title.recommendation'])}</h2>
      <div className="row course-recommendations-details">
        <div className="col-lg-6 col-sm-12">
        <p>
            {intl.formatMessage(messages['get.started.with'])}
            </p>
        <Button
              as={Link}
              to={`/${slug}/search`}
              className="btn-brand-primary d-block d-md-inline-block"
            >
              {intl.formatMessage(messages['btn.find.course'])}
            </Button>
        </div>
        <div className="col-lg-6 col-sm-12">
          <img className="course-recommendations-image" src={SkillsQuizImage} alt="Skills Quiz CTA" />
        </div>
      </div>
    </div>
  );
};

export default (injectIntl(CourseRecommendations));
