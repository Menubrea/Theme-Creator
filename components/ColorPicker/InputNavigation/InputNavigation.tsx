import React, { useRef } from 'react';
import { Box, ColorInput, NativeSelect, NumberInput, Text } from '@mantine/core';
import styles from './InputNavigation.module.css';

interface InputNavigationProps {
  value: string;
  contrast: string;
  onChange: (value: string) => void;
  setContrast: (value: string) => void;
  setType: (value: string) => void;
  setCount: (value: number) => void;
}

const InputNavigation = ({ ...props }: InputNavigationProps) => {
  const { value, onChange, contrast, setContrast, setType, setCount } = props;

  return (
    <Box className={styles.inputWrapper}>
      <Box>
        <Text fw={700} variant="h1">
          Create a Color Palette by adjusting the following settings
        </Text>
        <Text size="xs" style={{ marginBottom: 20 }}>
          Begin by selecting a primary colour and a contrast colour. Then choose a colour harmony
          and the number of colours you want in your palette.
        </Text>
      </Box>
      <Box className={styles.inputContainer}>
        <Box className={styles.flex}>
          <ColorInput
            size="xs"
            label="Primary Colour"
            style={{ width: '100%' }}
            value={value}
            onChange={onChange}
          />

          <ColorInput
            label="Contrast Colour"
            size="xs"
            style={{ width: '100%' }}
            value={contrast}
            onChange={setContrast}
          />
        </Box>
        <Box className={styles.flex}>
          <NativeSelect
            label="Colour Harmony"
            size="xs"
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
            size="xs"
            style={{ width: '100%' }}
            defaultValue={5}
            onChange={(value: string | number) => setCount(value as number)}
            max={10}
            min={3}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InputNavigation;
