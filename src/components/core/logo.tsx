'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@/components/theme/theme-provider';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 60;
const WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function Logo({ color = 'dark', emblem, height = HEIGHT, width = WIDTH }: LogoProps): React.JSX.Element {
  let url: string;

  if (emblem) {
    // Using the full logo for emblem as well since we don't have separate emblem files
    url = color === 'light' ? '/assets/logos/day_trade_dak_white_logo.png' : '/assets/logos/day_trade_dak_black_logo.png';
  } else {
    url = color === 'light' ? '/assets/logos/day_trade_dak_white_logo.png' : '/assets/logos/day_trade_dak_black_logo.png';
  }
  
  return <Box alt="logo" component="img" height={height} src={url} width={width} />;
}

export interface DynamicLogoProps {
  colorDark?: Color;
  colorLight?: Color;
  emblem?: boolean;
  height?: number;
  width?: number;
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}: DynamicLogoProps): React.JSX.Element {
  const { isDarkMode } = useTheme();
  const color = isDarkMode ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
