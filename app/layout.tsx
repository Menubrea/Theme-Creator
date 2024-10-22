import '@mantine/core/styles.css';
import { Appshell } from '../components/Appshell';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

import { theme } from '../theme';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'TH | Palette',
  description: 'Create and share color palettes',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <Analytics />
        <MantineProvider theme={theme}>
          <Appshell>{children}</Appshell>
        </MantineProvider>
      </body>
    </html>
  );
}
