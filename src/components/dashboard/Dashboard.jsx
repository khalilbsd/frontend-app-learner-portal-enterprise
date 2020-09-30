import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import MediaQuery from 'react-responsive';
import { StatusAlert, breakpoints } from '@edx/paragon';
import { AppContext } from '@edx/frontend-platform/react';

import { MainContent, Sidebar } from '../layout';
import { DashboardMainContent } from './main-content';
import { DashboardSidebar } from './sidebar';

export const LICENCE_ACTIVATION_MESSAGE = 'Your license has been successfully activated.';

export default function Dashboard() {
  const { enterpriseConfig } = useContext(AppContext);
  const { state } = useLocation();

  const renderLicenseActivationSuccess = () => (
    <>
      <div>
        <StatusAlert
          alertType="success"
          dialog={(
            <>
              {LICENCE_ACTIVATION_MESSAGE}
            </>
          )}
          open
        />
      </div>
    </>
  );

  const PAGE_TITLE = `My courses - ${enterpriseConfig.name}`;

  return (
    <>
      <Helmet title={PAGE_TITLE} />
      <div className="container-fluid py-5">
        {state?.activationSuccess && renderLicenseActivationSuccess()}
        <div className="row">
          <MainContent>
            <DashboardMainContent />
          </MainContent>
          <MediaQuery minWidth={breakpoints.large.minWidth}>
            {matches => matches && (
              <Sidebar data-testid="sidebar">
                <DashboardSidebar />
              </Sidebar>
            )}
          </MediaQuery>
        </div>
      </div>
    </>
  );
}
