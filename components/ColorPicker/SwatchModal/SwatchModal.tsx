import React, { useState } from 'react';
import chroma from 'chroma-js';
import { Box, Button, Modal, NumberInput } from '@mantine/core';
import styles from './SwatchModal.module.css';
import { IconBackground } from '@tabler/icons-react';

interface SwatchModalProps {
  opened: boolean;
  close: () => void;
  customColor: string;
}

const SwatchModal = ({ ...props }: SwatchModalProps) => {
  const { opened, close, customColor: value } = props;
  const [count, setCount] = useState(5);
  const [intensity, setIntensity] = useState(2);

  const handleCountChange = (value: string | number) => {
    setCount(value as number);
  };

  const handleIntensityChange = (value: string | number) => {
    setIntensity(value as number);
  };

  let swatch: string[] = [];
  swatch = chroma
    .scale([chroma(value).brighten(intensity), value, chroma(value).darken(intensity)])
    .mode('lab')
    .colors(count);

  return (
    <Modal
      centered
      size={'xl'}
      title={`Generating Swatches for ${chroma(value).name()}`}
      opened={opened}
      onClose={close}
      styles={{
        overlay: {
          backgroundColor: `${chroma(value).darken(0.5).alpha(0.5).toString()}`,
          backdropFilter: 'blur(5px)',
        },
        header: {
          backgroundColor: `${value}`,
          color: `${chroma(value).luminance() > 0.5 ? 'black' : 'white'}`,
        },
        body: {
          padding: 0,
        },
        close: {
          backgroundColor: `${chroma(value).darken(1).toString()}`,
          color: `${chroma(value).luminance() > 0.5 ? 'black' : 'white'}`,
        },
      }}
    >
      <Box style={{ display: 'flex', gap: 10, width: '100%', padding: 10 }}>
        <NumberInput
          label="Number of Swatches"
          style={{ width: '100%' }}
          min={5}
          max={9}
          defaultValue={5}
          onChange={handleCountChange}
        />
        <NumberInput
          label="Intensity of Swatches"
          style={{ width: '100%' }}
          min={1}
          max={4}
          defaultValue={2}
          onChange={handleIntensityChange}
        />
      </Box>
      <Box className={styles.swatchContainer}>
        {swatch.map((color, i) => (
          <Box
            key={i}
            onClick={() => navigator.clipboard.writeText(color)}
            style={{
              backgroundColor: color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SwatchButton text={color} />
          </Box>
        ))}
      </Box>
    </Modal>
  );
};

interface SwatchButtonProps {
  text: string;
}

const SwatchButton = ({ ...props }: SwatchButtonProps) => {
  const { text } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Button
      onClick={(e) => handleCopy((e.target as HTMLButtonElement).value)}
      variant="subtle"
      color={chroma(text).luminance() > 0.5 ? 'black' : 'white'}
    >
      {copied ? 'Copied' : text}
    </Button>
  );
};

export default SwatchModal;
