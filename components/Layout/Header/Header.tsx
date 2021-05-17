import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useAuth } from 'components/UserContext/UserContext';
import { getData } from 'utils/saveData';
import { getUserType } from 'utils/user';
import Logo from './Logo';

const loggedNavLinks = [
  {
    name: 'Search',
    path: '/search',
    isSelected: (pathname: string) =>
      pathname === '/search' || pathname === '/cases',
  },
  {
    name: 'My work space',
    path: '/',
    isSelected: (pathname: string) =>
      pathname === '/' ||
      pathname === '/my-records' ||
      pathname === '/forms-in-progress',
  },
  {
    name: 'Manage workers',
    path: '/workers',
  },
  {
    name: 'Logout',
    path: '/logout',
  },
];

const HeaderComponent = ({
  serviceName,
}: {
  serviceName: string;
}): React.ReactElement => {
  const { user } = useAuth();
  const { pathname } = useRouter();
  const [navLinks, setNavLinks] = useState<typeof loggedNavLinks>();
  useEffect(() => {
    if (user) {
      const savedForms = getData();
      setNavLinks(
        loggedNavLinks
          .filter(({ name }) => name !== 'Forms in progress' || savedForms)
          .filter(
            ({ name }) => name !== 'Manage workers' || user.hasDevPermissions
          )
      );
    }
  }, [user, pathname]);
  return (
    <header className="govuk-header" role="banner" data-module="govuk-header">
      <div className="govuk-header__container">
        <div className="govuk-width-container">
          <div className="govuk-header__logo">
            <Link href="/">
              <a className="govuk-header__link govuk-header__link--homepage">
                <span className="govuk-header__logotype">
                  <Logo />
                </span>
              </a>
            </Link>
          </div>
          <div className="govuk-header__content">
            <Link href="/">
              <a className="govuk-header__link govuk-header__link--service-name">
                {serviceName} {user && getUserType(user)}
              </a>
            </Link>
            {navLinks && (
              <>
                <button
                  type="button"
                  className="govuk-header__menu-button govuk-js-header-toggle"
                  aria-controls="navigation"
                  aria-label="Show or hide navigation menu"
                >
                  Menu
                </button>
                <nav>
                  <ul
                    id="navigation"
                    className="govuk-header__navigation "
                    aria-label="Navigation menu"
                  >
                    {navLinks.map(({ name, path, isSelected }) => (
                      <li
                        key={path}
                        className={cx('govuk-header__navigation-item', {
                          'govuk-header__navigation-item--active':
                            isSelected?.(pathname) || path === pathname,
                        })}
                      >
                        <Link href={path}>
                          <a className="govuk-header__link">{name}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
