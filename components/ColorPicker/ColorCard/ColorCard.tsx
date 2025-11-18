import { hexToCMYK } from '@/app/helpers';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { SwatchModal } from '../SwatchModal';
import chroma from 'chroma-js';
import { FaCopy } from 'react-icons/fa';
import styles from './ColorCard.module.css';
import { Box, Text, Badge, Button, ColorInput } from '@mantine/core';

interface ColorCardProps {
  color: string;
  contrast: string;
  click?: boolean;
  message?: string;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

function ColorCard({ ...props }: ColorCardProps) {
  const { color, contrast, setClick, setMessage } = props;
  const [customColor, setCustomColor] = useState<string>(color);
  const [contrastValue, setContrastValue] = useState<number>(0);
  const [opened, { open, close }] = useDisclosure(false);

  let rgb = chroma(customColor || color)
    .rgb()
    .splice(0, 3)
    .join(', ');
  let cmyk = Object.values(hexToCMYK(customColor || color))
    .map((val) => Math.round(val * 100))
    .join(', ');

  let contrastText: string;
  let contrastColor: string;

  useEffect(() => {
    if (contrast.length !== 7) return;
    setContrastValue(chroma.contrast(customColor, contrast));
  }, [customColor, contrast]);

  useEffect(() => {
    setCustomColor(color);
  }, [color]);

  const handleOnchange = (value: string) => {
    if (value.length !== 7) return;
    setCustomColor(value);
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setClick(true);
    setMessage(`(${value}) copied to clipboard`);

    setTimeout(() => {
      setClick(false);
      setMessage('');
    }, 1500);
  };

  return (
    <Box>
      <Box className={styles.card} style={{ backgroundColor: customColor || color }}>
        <Box className={styles.cardText}>
          <Text style={{ fontSize: '3rem' }} fw={900} color={contrast}>
            Aa
          </Text>
        </Box>
        <Box
          className={styles.cardContrast}
          style={{ backgroundColor: chroma(customColor).brighten(3).toString() }}
        >
          <Box className={styles.justifyBetween} mt={10}>
            <Text size="xs" fw={700}>
              Contrast
            </Text>
            <Box className={styles.justifyBetween}>
              <Text size="xs" fw={900} color={contrastValue ? 'darkgreen' : 'darkred'}>
                {contrastValue.toFixed(2)}
              </Text>
              <Badge ml={10} size="xs" color={contrastValue >= 4.5 ? 'darkgreen' : 'darkred'}>
                {contrastValue >= 7 ? ' AAA' : contrastValue >= 4.5 ? ' AA' : ' Fail'}
              </Badge>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        className={styles.cardContent}
        style={{ backgroundColor: chroma(customColor).brighten(4).toString() }}
      >
        <ColorInput size="xs" value={customColor} onChange={handleOnchange} />

        <ButtonGroup
          colorText="HEX"
          colorValue={chroma(customColor || color).hex()}
          handleCopy={() => handleCopy(chroma(customColor || color).hex())}
        />
        <ButtonGroup colorText="RGB" colorValue={rgb} handleCopy={() => handleCopy(rgb)} />
        <ButtonGroup colorText="CMYK" colorValue={cmyk} handleCopy={() => handleCopy(cmyk)} />
        <Button onClick={open} mt={10} size="xs" color="#822C76" fullWidth>
          Generate Swatch
        </Button>
      </Box>
      <SwatchModal customColor={customColor} opened={opened} close={close} />
    </Box>
  );
}

interface ButtonGroupProps {
  colorText: string;
  colorValue: string;
  handleCopy: (value: string) => void;
}

const ButtonGroup = ({ ...props }: ButtonGroupProps) => {
  const { colorText, colorValue, handleCopy } = props;

  return (
    <Box className={styles.buttonGroup} mt={10}>
      <Text size="xs" color="#333" fw={700}>
        {colorText}
      </Text>
      <Button
        onClick={() => handleCopy(colorValue)}
        size="xs"
        rightSection={<FaCopy size={14} />}
        variant="subtle"
        color="#333"
      >
        {colorValue}
      </Button>
    </Box>
  );
};

export default ColorCard;
