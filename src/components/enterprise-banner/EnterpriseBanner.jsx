import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { Button, Container } from '@edx/paragon';

import './styles/EnterpriseBanner.scss';

export default function EnterpriseBanner() {
  const location = useLocation();
  const { enterpriseConfig } = useContext(AppContext);
  const isSearchPage = `/${ enterpriseConfig.slug }/search` === location.pathname;
  return (
    <div className="enterprise-banner border-brand-tertiary">
      <Container size="lg">
        <div className="row banner-content">
          <h1 className="h2 mb-0 py-3 pl-3 text-brand-secondary">
            {enterpriseConfig.name}
          </h1>
        </div>
      </Container>
    </div>
  );
}
