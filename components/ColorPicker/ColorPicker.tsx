'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  ColorInput,
  NativeSelect,
  Text,
  Divider,
  Badge,
  Modal,
  Notification,
  NumberInput,
} from '@mantine/core';
import classes from './ColorPicker.module.css';
import { FaCopy } from 'react-icons/fa';
import { FaCircleCheck } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import chroma from 'chroma-js';
import { useDisclosure } from '@mantine/hooks';
import SuccessImage from '/public/success.svg';

function hexToCMYK(hex: string) {
  const rgbColor = chroma(hex).rgb();

  const r = rgbColor[0] / 255;
  const g = rgbColor[1] / 255;
  const b = rgbColor[2] / 255;

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return { c, m, y, k };
}

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
      <Box className={classes.container} style={{ backgroundColor: customColor || color }}>
        <Box className={classes.containerText}>
          <Text style={{ fontSize: '3rem' }} fw={900} color={contrast}>
            Aa
          </Text>
        </Box>
        <Box
          className={classes.containerContrast}
          style={{ backgroundColor: chroma(customColor).brighten(3).toString() }}
        >
          <Box className={classes.justifyBetween} mt={10}>
            <Text size="xs" fw={900}>
              Contrast
            </Text>
            <Text size="xs" fw={900} color={contrastValue ? 'darkgreen' : 'darkred'}>
              {contrastValue.toFixed(2)}
            </Text>
          </Box>
          <Divider color="black" my="sm" />
          <Box className={classes.justifyCenter}>
            <Badge
              size="md"
              variant="light"
              leftSection={contrastValue >= 7 ? <FaCircleCheck /> : <MdCancel />}
              color={contrastValue >= 7 ? 'darkgreen' : 'darkred'}
            >
              AAA
            </Badge>{' '}
            /{' '}
            <Badge
              variant="light"
              leftSection={contrastValue >= 4.5 ? <FaCircleCheck /> : <MdCancel />}
              size="md"
              color={contrastValue >= 4.5 ? 'darkgreen' : 'darkred'}
            >
              AA
            </Badge>
          </Box>
        </Box>
      </Box>
      <Box mt={10}>
        <ColorInput size="xs" value={customColor} onChange={handleOnchange} />

        <Box className={classes.justifyBetween} mt={10}>
          <Text size="xs" fw={900}>
            HEX
          </Text>
          <Button
            onClick={() => handleCopy(chroma(color).hex())}
            size="xs"
            rightSection={<FaCopy size={14} />}
            variant="subtle"
            color="black"
          >
            {chroma(customColor || color).hex()}
          </Button>
        </Box>
        <Box className={classes.justifyBetween} mt={10}>
          <Text size="xs" fw={900}>
            RGB
          </Text>
          <Button
            onClick={() => handleCopy(rgb)}
            size="xs"
            rightSection={<FaCopy size={14} />}
            variant="subtle"
            color="black"
          >
            {rgb}
          </Button>
        </Box>
        <Box className={classes.justifyBetween} mt={10}>
          <Text size="xs" fw={900}>
            CMYK
          </Text>
          <Button
            onClick={() => handleCopy(cmyk)}
            size="xs"
            rightSection={<FaCopy size={14} />}
            variant="subtle"
            color="black"
          >
            {cmyk}
          </Button>
        </Box>
        <Button onClick={open} mt={10} size="xs" variant="outline" fullWidth color="blue">
          Generate Swatch
        </Button>
      </Box>
      <SwatchModal customColor={customColor} opened={opened} close={close} />
    </Box>
  );
}

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

      <Box className={classes.inputWrapper}>
        <Box className={classes.inputContainer}>
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
      <Box className={classes.grid}>
        {harmony.map((color, i) => (
          <ColorCard key={i} color={color} {...props} />
        ))}
      </Box>
    </Box>
  );
}

interface PreviewModalProps {
  opened: boolean;
  close: () => void;
  contrast: string;
  harmony: string[];
}

const PreviewModal = ({ ...props }: PreviewModalProps) => {
  const { opened, close, contrast, harmony } = props;
  return (
    <Modal
      centered
      size={'xl'}
      opened={opened}
      onClose={close}
      styles={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
        },
        header: {},
        body: {
          padding: 0,
        },
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        p={32}
      >
        <Box>
          <Text
            color={harmony[0]}
            tt={'uppercase'}
            variant="h1"
            style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}
          >
            Lorem ipsum dolor amet consectetur adipisicing.
          </Text>
          <Text variant="p" size="md" mt={16}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis est doloribus dolores
            porro
            <Text variant="span" fw={900} color={harmony[4]}>
              rem perferendis nisi expedita debitis veniam.
            </Text>
            Expedita debitis veniam.
          </Text>
          <Button
            fullWidth
            mt={32}
            size="md"
            onClick={close}
            style={{ color: contrast, backgroundColor: harmony[4] }}
          >
            Use Palette
          </Button>
        </Box>
        <img style={{ width: '300px' }} src={SuccessImage.src} alt="Success" />
      </Box>
      <Divider />
      <Box p={32} style={{ display: 'flex', gap: '1.5rem' }}>
        <Box>
          <Text tt={'uppercase'} variant="h2" size="lg" fw={900}>
            Lorem ipsum
          </Text>
          <Text variant="p" size="sm" mt={8}>
            Lorem ipsum dolor sit amet consectetur. Veritatis est doloribus dolores porro rem
            perferendis nisi expedita debitis veniam.
          </Text>
          <Button mt={24} style={{ color: contrast, backgroundColor: harmony[3] }}>
            Lorem Ipsum
          </Button>
        </Box>
        <Box>
          <Text tt={'uppercase'} variant="h2" size="lg" fw={900}>
            Lorem ipsum
          </Text>
          <Text variant="p" size="sm" mt={8}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis est doloribus dolores
            porro remnisi expedita debitis veniam.
          </Text>
          <Button mt={24} style={{ color: contrast, backgroundColor: harmony[3] }}>
            Lorem Ipsum
          </Button>
        </Box>
        <Box>
          <Text tt={'uppercase'} variant="h2" size="lg" fw={900}>
            Lorem ipsum
          </Text>
          <Text variant="p" size="sm" mt={8}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis est doloribus dolores
            porro rem perferendi expedita debitis veniam.
          </Text>
          <Box>
            <Button mt={24} style={{ color: contrast, backgroundColor: harmony[3] }}>
              Lorem Ipsum
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

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
      title="Swatch Generator"
      opened={opened}
      onClose={close}
      styles={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, .5)',
        },
        header: { borderBottom: '1px solid #000' },
        body: {
          padding: 0,
        },
      }}
    >
      <Box style={{ display: 'flex', gap: 10, width: '100%', padding: 10 }}>
        <NumberInput
          label="Number of Swatches"
          description="Number of swatches in total"
          style={{ width: '100%' }}
          min={5}
          max={9}
          defaultValue={5}
          onChange={handleCountChange}
        />
        <NumberInput
          label="Intensity of Swatches"
          style={{ width: '100%' }}
          description="Variation between swatches"
          min={1}
          max={4}
          defaultValue={2}
          onChange={handleIntensityChange}
        />
      </Box>
      <Box className={classes.swatchContainer}>
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
export default ColorPick;
