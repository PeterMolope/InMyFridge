import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'green' | 'cyan' | 'pink';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  variant = 'green',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
}) => {
  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case 'cyan':
        return ['#00F3FF', '#FF00FF'];
      case 'pink':
        return ['#FF00FF', '#9D00FF'];
      default:
        return ['#39FF14', '#00F3FF'];
    }
  };

  const getNeonGlow = () => {
    switch (variant) {
      case 'cyan':
        return 'shadow-neon-cyan';
      case 'pink':
        return 'shadow-neon-pink';
      default:
        return 'shadow-neon-green';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 rounded-lg';
      case 'large':
        return 'px-8 py-4 rounded-2xl';
      default:
        return 'px-6 py-3 rounded-xl';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm font-semibold';
      case 'large':
        return 'text-lg font-bold';
      default:
        return 'text-base font-bold';
    }
  };

  if (disabled) {
    return (
      <View
        className={`bg-abyss-layer border border-gray-600 ${getSizeClasses()} items-center justify-center opacity-50`}
      >
        <Text className={`text-gray-500 ${getTextSize()}`}>{title}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
      <View className={`relative ${getNeonGlow()}`}>
        {/* Glassmorphism overlay */}
        <BlurView intensity={20} className={`absolute inset-0 ${getSizeClasses()} rounded-xl`} />
        
        {/* Liquid gradient background */}
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={`${getSizeClasses()} items-center justify-center`}
          style={{ 
            borderRadius: size === 'small' ? 8 : size === 'large' ? 16 : 12,
          }}
        >
          {/* Traced frame border */}
          <View
            className={`absolute inset-0 ${getSizeClasses()} border-2 border-transparent`}
            style={{
              borderWidth: 2,
              borderColor: 'transparent',
              borderRadius: size === 'small' ? 8 : size === 'large' ? 16 : 12,
              borderStyle: 'solid',
            }}
          />
          
          <View className="flex-row items-center space-x-2">
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                {icon && <View>{icon}</View>}
                <Text className={`text-white ${getTextSize()} font-tech`}>
                  {title}
                </Text>
              </>
            )}
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

export default NeonButton;
