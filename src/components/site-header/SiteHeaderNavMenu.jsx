import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

const SiteHeaderNavMenu = ({intl}) => {
  const { enterpriseConfig } = useContext(AppContext);
  const mainMenuLinkClassName = 'nav-link';

  if (enterpriseConfig.disableSearch) {
    return null;
  }

  return (
    <>
      <NavLink to={`/${enterpriseConfig.slug}`} className={mainMenuLinkClassName} exact>
        {intl.formatMessage(messages['header.nav.link.dashboard'])}
      </NavLink>
      <NavLink to={`/${enterpriseConfig.slug}/search`} className={mainMenuLinkClassName} exact>
        {intl.formatMessage(messages['header.nav.link.search'])}
      </NavLink>
    </>
  );
};

export default (injectIntl(SiteHeaderNavMenu));
