'use client';
import React from 'react';
import { useState } from 'react';
import { Box, Notification, Skeleton } from '@mantine/core';
import styles from './ColorPicker.module.css';
import { ColorCard } from './ColorCard';
import { InputNavigation } from './InputNavigation';

import chroma from 'chroma-js';
import { useDisclosure } from '@mantine/hooks';

function ColorPick() {
  const [value, onChange] = useState('#195c61');
  const [type, setType] = useState<string>('Complementary');
  const [harmony, setHarmony] = useState<string[]>([]);
  const [contrast, setContrast] = useState<string>('#ffffff');
  const [opened, { open, close }] = useDisclosure(false);
  const [count, setCount] = useState(5);
  const [click, setClick] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 20);

  const props = {
    contrast,
    value,
    opened,
    message,
    click,
    harmony,
    setCount,
    setContrast,
    setType,
    onChange,
    open,
    close,
    setClick,
    setMessage,
  };

  React.useEffect(() => {
    let harmonyColors: string[] = [];

    if (value.length !== 7) return;

    switch (type) {
      case 'Complementary':
        harmonyColors = chroma
          .scale([value, chroma(value).set('hsl.h', '+180')])
          .mode('lab')
          .colors(count);
        break;
      case 'Analogous':
        harmonyColors = chroma
          .scale([chroma(value).set('hsl.h', '-30'), value, chroma(value).set('hsl.h', '+30')])
          .mode('lab')
          .colors(count);
        break;
      case 'Triadic':
        harmonyColors = chroma
          .scale([value, chroma(value).set('hsl.h', '+120'), chroma(value).set('hsl.h', '-120')])
          .mode('lab')
          .colors(count);
        break;
      case 'Split-complementary':
        harmonyColors = chroma
          .scale([value, chroma(value).set('hsl.h', '+150'), chroma(value).set('hsl.h', '-150')])
          .mode('lab')
          .colors(count);
        break;
      case 'Square':
        harmonyColors = chroma
          .scale([
            value,
            chroma(value).set('hsl.h', '+90'),
            chroma(value).set('hsl.h', '+180'),
            chroma(value).set('hsl.h', '+270'),
          ])
          .mode('lab')
          .colors(count);
        break;
      case 'Tetradic':
        harmonyColors = chroma
          .scale([
            value,
            chroma(value).set('hsl.h', '+60'),
            chroma(value).set('hsl.h', '+180'),
            chroma(value).set('hsl.h', '+240'),
          ])
          .mode('lab')
          .colors(count);
        break;
      case 'Monochromatic':
        harmonyColors = chroma
          .scale([chroma(value).brighten(2), value, chroma(value).darken(2)])
          .mode('lab')
          .colors(count);
        break;
      default:
        harmonyColors = [];
        break;
    }

    setHarmony(harmonyColors);
  }, [value, type, count]);

  return (
    <Box style={{ position: 'relative' }}>
      <Box style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1000 }}>
        {click && <Notification withBorder withCloseButton={false} title={message} />}
      </Box>
      <InputNavigation {...props} />
      <Box className={styles.grid}>
        {loading
          ? [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          : harmony.map((color, i) => <ColorCard key={i} color={color} {...props} />)}
      </Box>
    </Box>
  );
}

const SkeletonCard = () => {
  return (
    <Box>
      <Skeleton height={300} />
      <Skeleton mt={10} height={215} />
    </Box>
  );
};

export default ColorPick;
