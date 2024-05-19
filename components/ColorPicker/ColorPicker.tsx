'use client';
import React from 'react';
import { useState } from 'react';
import { Box, ColorInput, NativeSelect, Notification, NumberInput } from '@mantine/core';
import styles from './ColorPicker.module.css';
import { ColorCard } from './ColorCard';

import chroma from 'chroma-js';
import { useDisclosure } from '@mantine/hooks';

function ColorPick() {
  const [value, onChange] = useState('#2b888f');
  const [type, setType] = useState<string>('Complementary');
  const [harmony, setHarmony] = useState<string[]>([]);
  const [contrast, setContrast] = useState<string>('#000000');
  const [opened, { open, close }] = useDisclosure(false);
  const [count, setCount] = useState(5);
  const [click, setClick] = useState(false);
  const [message, setMessage] = useState('');

  const props = {
    contrast,
    value,
    opened,
    message,
    click,
    harmony,
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

      <Box className={styles.inputWrapper}>
        <Box className={styles.inputContainer}>
          <ColorInput
            label="Set Primary Colour"
            style={{ width: '100%' }}
            value={value}
            onChange={onChange}
          />

          <ColorInput
            label="Set Contrast Colour"
            style={{ width: '100%' }}
            value={contrast}
            onChange={setContrast}
          />
          <NativeSelect
            label="Set Colour Harmony"
            style={{ width: '100%' }}
            onChange={(e) => setType(e.currentTarget.value)}
            data={[
              'Complementary',
              'Analogous',
              'Triadic',
              'Split-complementary',
              'Square',
              'Tetradic',
              'Monochromatic',
            ]}
          />
          <NumberInput
            label="Number of Colors"
            style={{ width: '100%' }}
            defaultValue={5}
            onChange={(value: string | number) => setCount(value as number)}
            max={10}
            min={3}
          />
        </Box>
      </Box>
      <Box className={styles.grid}>
        {harmony.map((color, i) => (
          <ColorCard key={i} color={color} {...props} />
        ))}
      </Box>
    </Box>
  );
}

export default ColorPick;
