// import { StatusBar } from 'expo-status-bar';
// import { ChefHat } from 'lucide-react-native';
// import React, { useEffect, useRef } from 'react';
// import { Animated, Dimensions, View } from 'react-native';
// import { useFridgeStore } from '../context/fridgeStore';
// import { useNeonTheme } from '../theme/NeonTheme';

///************************** */
import { StatusBar } from 'expo-status-bar';
import { ChefHat } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useFridgeStore } from '../context/fridgeStore';
import { useNeonTheme } from '../theme/NeonTheme';

interface SplashScreenProps {
  onComplete: () => void;
}

const { width } = Dimensions.get('window');

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { theme } = useNeonTheme();
  const initializeItems = useFridgeStore((state) => state.initializeItems);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Initialize app data
        await initializeItems();

        // Animate in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          })
        ]).start();

        // Show splash for 3 seconds to ensure app fully loads
        setTimeout(() => {
          if (!isMounted) return;
          
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
          });
        }, 3000);

      } catch (error) {
        console.error('Initialization failed', error);
        onComplete();
      }
    };

    initializeApp();
    return () => { isMounted = false; };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <StatusBar hidden={true} />

      <Animated.View
        style={{
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.glass,
          borderWidth: 2,
          borderColor: theme.colors.glassBorder,
          justifyContent: 'center',
          alignItems: 'center',
          // Note: Shadow properties don't support useNativeDriver: true
          // To keep it high-perf, we animate scale/opacity and let the shadow follow
          shadowColor: theme.colors.glow,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5, 
          shadowRadius: 20,
          elevation: 20,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim }
          ],
        }}
      >
        <ChefHat 
          size={width * 0.2} 
          color={theme.colors.primary} 
          strokeWidth={2}
        />
      </Animated.View>
    </View>
  );
}