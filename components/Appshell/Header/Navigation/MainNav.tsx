'use client';

import { NavLink } from '@mantine/core';
import React, { use } from 'react';
import styles from './MainNav.module.css';
import { usePathname } from 'next/navigation';
import { IoChevronDown } from 'react-icons/io5';
import { CiHome } from 'react-icons/ci';
import { IoIosColorPalette } from 'react-icons/io';
import { GoTypography } from 'react-icons/go';

const links: string[] = ['Home', 'Colours', 'Typography'];

const MainNav = () => {
  let route = usePathname();

  return (
    <nav>
      <ul className={styles.navElements}>
        {links.map((link) => (
          <li key={link}>
            <NavLink
              color="red"
              active={link === 'Home' ? route === '/' : route === `/${link.toLowerCase()}`}
              href={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
              label={link}
              rightSection={link !== 'Home' && <IoChevronDown />}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MainNav;
