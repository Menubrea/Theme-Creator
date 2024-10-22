import React from 'react';
import styles from './Footer.module.css';
import { Anchor, Box, Group, Tooltip } from '@mantine/core';
import svglogo from '@/public/logo-dark.svg';

import { FaGithub, FaLinkedin, FaCodepen, FaInstagram } from 'react-icons/fa';

const socialMedia = [
  {
    name: 'Instagram',
    icon: <FaInstagram />,
    url: '#',
  },
  {
    name: 'Codepen',
    icon: <FaCodepen />,
    url: '#',
  },
  {
    name: 'LinkedIn',
    icon: <FaLinkedin />,
    url: '#',
  },
  {
    name: 'Github',
    icon: <FaGithub />,
    url: '#',
  },
];

const Socials = () => {
  return (
    <Group gap={8}>
      {socialMedia.map((media, i) => (
        <Box key={i}>
          <Tooltip position="bottom" label={media.name}>
            <Anchor style={{ color: '#343F3D' }} size="lg" href={media.url}>
              {media.icon}
            </Anchor>
          </Tooltip>
        </Box>
      ))}
    </Group>
  );
};

const Footer = () => {
  return (
    <Box className={styles.container}>
      <footer className={styles.footer}>
        <img src={svglogo.src} alt="logo" />
        <Socials />
      </footer>
    </Box>
  );
};

export default Footer;
