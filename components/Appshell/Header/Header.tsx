import React from 'react';
import { Box } from '@mantine/core';
import styles from './Header.module.css';
import { MainNav } from './Navigation';

const Header = () => {
  return (
    <Box component="header" className={styles.container}>
      <Box className={styles.header}>
        <Box>Logo</Box>
        <MainNav />
      </Box>
    </Box>
  );
};

export default Header;
