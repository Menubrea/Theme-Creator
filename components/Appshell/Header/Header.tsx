'use client';
import React from 'react';
import { Anchor, Box, Burger, Container, Group } from '@mantine/core';
import classes from './Header.module.css';
import svglogo from '@/public/logo-dark.svg';
import { useDisclosure } from '@mantine/hooks';

const mainLinks = [
  { link: '#', label: 'Colours' },
  { link: '#', label: 'Typography' },
];

const userLinks = [
  { link: '#', label: 'Privacy & Security' },
  { link: '#', label: 'Account settings' },
  { link: '#', label: 'Support options' },
];

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = React.useState(0);

  const mainItems = mainLinks.map((item, index) => (
    <Anchor<'a'>
      href={item.link}
      key={item.label}
      className={classes.mainLink}
      data-active={index === active || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(index);
      }}
    >
      {item.label}
    </Anchor>
  ));

  const secondaryItems = userLinks.map((item) => (
    <Anchor
      href={item.link}
      key={item.label}
      onClick={(event) => event.preventDefault()}
      className={classes.secondaryLink}
    >
      {item.label}
    </Anchor>
  ));

  return (
    <header className={classes.header}>
      <Container className={classes.inner}>
        <img src={svglogo.src} alt="logo" width={50} />
        <Box className={classes.links} visibleFrom="sm">
          <Group justify="flex-end">{secondaryItems}</Group>
          <Group gap={0} justify="flex-end" className={classes.mainLinks}>
            {mainItems}
          </Group>
        </Box>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
          hiddenFrom="sm"
        />
      </Container>
    </header>
  );
};

export default Header;
