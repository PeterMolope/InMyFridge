import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '../lib/utils';

export type CustomTextProps = RNTextProps;

export function Text({ className, ...props }: CustomTextProps) {
  return (
    <RNText
      className={cn('font-archivo text-foreground', className)}
      {...props}
    />
  );
}
