import React from 'react';
import { Box } from '@mantine/core';
import styles from './Header.module.css';
import svglogo from '@/public/logo-dark.svg';

const Header = () => {
  return (
    <Box component="header" className={styles.container}>
      <Box className={styles.header}>
        <img style={{ width: '130px' }} src={svglogo.src} alt="logo" />
      </Box>
    </Box>
  );
};

export default Header;
