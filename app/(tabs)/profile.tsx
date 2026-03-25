import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, HelpCircle, ChevronRight, Camera, Moon, Sun } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import Colors from '@/constants/Colors';

cssInterop(User, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Settings, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Bell, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Shield, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(HelpCircle, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(ChevronRight, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Camera, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Moon, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Sun, { className: { target: 'style', nativeStyleToProp: { color: true } } });

type SettingItem = {
  id: string;
  title: string;
  description?: string;
  icon: any;
  type: 'toggle' | 'action' | 'navigation';
  value?: boolean;
  onPress?: () => void;
};

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const profileSettings: SettingItem[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: User,
      type: 'navigation',
      onPress: () => console.log('Edit profile'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      type: 'toggle',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      icon: Shield,
      type: 'navigation',
      onPress: () => console.log('Privacy settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help with the app',
      icon: HelpCircle,
      type: 'navigation',
      onPress: () => console.log('Help center'),
    },
    {
      id: 'about',
      title: 'About',
      description: 'App version and information',
      icon: Settings,
      type: 'navigation',
      onPress: () => console.log('About'),
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      className="glass-card rounded-2xl p-4 neon-border mb-3"
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full glass-card flex items-center justify-center mr-4">
          <item.icon className="text-neon-green" size={20} />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white mb-1">
            {item.title}
          </Text>
          {item.description && (
            <Text className="text-sm text-white/60">
              {item.description}
            </Text>
          )}
        </View>
        
        {item.type === 'toggle' ? (
          <TouchableOpacity
            onPress={() => item.onPress?.()}
            className={`w-12 h-6 rounded-full p-1 ${
              item.value ? 'bg-neon-green' : 'bg-white/20'
            }`}
          >
            <View
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                item.value ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </TouchableOpacity>
        ) : (
          <ChevronRight className="text-white/60" size={20} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-abyss-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-neon-green/60 text-sm">Profile</Text>
            <Text className="text-2xl font-bold text-white tracking-tighter">Settings</Text>
          </View>
        </View>
      </View>

      {/* Profile Section */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 128 }}
      >
        {/* Profile Card */}
        <View className="glass-card rounded-2xl overflow-hidden neon-border mb-6">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="relative">
                <Image
                  source={{ uri: 'https://via.placeholder.com/80' }}
                  className="w-20 h-20 rounded-full mr-4"
                  resizeMode="cover"
                />
                <TouchableOpacity className="absolute bottom-0 right-2 bg-neon-green rounded-full p-2">
                  <Camera className="text-black" size={14} />
                </TouchableOpacity>
              </View>
              
              <View className="flex-1">
                <Text className="text-xl font-bold text-white mb-1">
                  Cyber User
                </Text>
                <Text className="text-sm text-white/60 mb-2">
                  user@inmyfridge.app
                </Text>
                <View className="flex-row gap-2">
                  <View className="px-3 py-1 bg-neon-green/20 rounded-full">
                    <Text className="text-xs font-medium text-neon-green">
                      PRO Member
                    </Text>
                  </View>
                  <View className="px-3 py-1 glass-card rounded-full">
                    <Text className="text-xs font-medium text-white/60">
                      Since 2024
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Stats */}
            <View className="flex-row justify-around pt-4 border-t border-white/20">
              <View className="items-center">
                <Text className="text-2xl font-bold text-white mb-1">142</Text>
                <Text className="text-xs text-white/60">Recipes</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white mb-1">28</Text>
                <Text className="text-xs text-white/60">Days Active</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-white mb-1">89%</Text>
                <Text className="text-xs text-white/60">Food Saved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-neon-green mb-3 uppercase tracking-widest">
            Quick Actions
          </Text>
          
          <View className="grid grid-cols-2 gap-3">
            <TouchableOpacity className="glass-card rounded-xl p-4 neon-border">
              <Moon className="text-neon-green mb-2" size={24} />
              <Text className="text-white font-medium">Dark Mode</Text>
              <Text className="text-xs text-white/60 mt-1">Always On</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="glass-card rounded-xl p-4 neon-border">
              <Bell className="text-neon-green mb-2" size={24} />
              <Text className="text-white font-medium">Notifications</Text>
              <Text className="text-xs text-white/60 mt-1">Enabled</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings List */}
        <View>
          <Text className="text-sm font-bold text-neon-green mb-3 uppercase tracking-widest">
            Settings
          </Text>
          
          {profileSettings.map(renderSettingItem)}
        </View>

        {/* App Info */}
        <View className="glass-card rounded-2xl p-4 neon-border mt-6">
          <View className="items-center">
            <Text className="text-sm text-white/60 mb-2">
              InMyFridge Cyber Edition
            </Text>
            <Text className="text-xs text-white/40">
              Version 2.0.1 • Build 2024.03.25
            </Text>
            <Text className="text-xs text-neon-green mt-2">
              Powered by Neural Networks
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
