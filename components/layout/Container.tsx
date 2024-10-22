import React from 'react';
import { Box } from '@mantine/core';
import styles from './Container.module.css';

const Container = ({ children }: { children: React.ReactNode }) => {
  return <Box className={styles.container}>{children}</Box>;
};

export default Container;
