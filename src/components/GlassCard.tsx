import React from 'react';
import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'glow';
  neonColor?: 'green' | 'cyan' | 'pink';
  intensity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  neonColor = 'green',
  intensity = 20,
  style,
  ...props
}) => {
  const getNeonGlow = () => {
    switch (neonColor) {
      case 'cyan':
        return 'shadow-neon-cyan';
      case 'pink':
        return 'shadow-neon-pink';
      default:
        return 'shadow-neon-green';
    }
  };

  const getBorderClass = () => {
    if (variant === 'bordered') {
      return 'border border-white/18';
    }
    return '';
  };

  const getGlowClass = () => {
    if (variant === 'glow') {
      return getNeonGlow();
    }
    return 'shadow-glass';
  };

  return (
    <View
      className={`${getGlowClass()} ${getBorderClass()} overflow-hidden`}
      style={style}
      {...props}
    >
      {/* Glassmorphism blur background */}
      <BlurView
        intensity={intensity}
        className="absolute inset-0"
        tint="dark"
      />
      
      {/* Semi-transparent surface */}
      <View 
        className="absolute inset-0 bg-abyss-surface/70"
      />
      
      {/* Content */}
      <View className="relative z-10">
        {children}
      </View>
    </View>
  );
};

export default GlassCard;
