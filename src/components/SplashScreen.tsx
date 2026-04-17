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
import { Animated, Dimensions, Easing, View } from 'react-native';
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
  const masterAnim = useRef(new Animated.Value(0)).current; // 0 to 1 for entrance
  const glowAnim = useRef(new Animated.Value(0)).current;   // 0 to 1 for breathing loop

  useEffect(() => {
    let isMounted = true;

    const runAnimations = async () => {
      try {
        // 1. Start App Initialization
        await initializeItems();

        // 2. Entrance Animation (Opacity and Scale)
        Animated.timing(masterAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }).start();

        // 3. Start Breathing Glow Loop separately
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true, // shadowOpacity doesn't support native driver, but scale does
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        ).start();

        // 4. Wait for 10 seconds (Testing delay)
        setTimeout(() => {
          if (!isMounted) return;

          // 5. Exit Animation
          Animated.timing(masterAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.exp),
            useNativeDriver: true,
          }).start(() => {
            onComplete();
          });
        }, 5000);

      } catch (error) {
        console.error('Initialization failed', error);
        onComplete();
      }
    };

    runAnimations();
    return () => { isMounted = false; };
  }, []);

  // Interpolations for smoother control
  const mainScale = masterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const breathScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05], // Subtle pulse
  });

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
          opacity: masterAnim,
          transform: [
            { scale: mainScale },
            { scale: breathScale }
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