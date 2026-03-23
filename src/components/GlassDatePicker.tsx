import dayjs from 'dayjs';
import { BlurView } from 'expo-blur';
import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CALENDAR_WIDTH = Math.min(screenWidth - 32, 400);
const CELL_SIZE = Math.floor(CALENDAR_WIDTH / 7);

// Liquid Glass Design System Tokens
const GLASS_TOKENS = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'rgba(255, 255, 255, 0.2)',
  textPrimary: 'rgba(59, 130, 246, 0.95)',
  textSecondary: 'rgba(156, 163, 175, 0.8)',
  accent: 'rgba(59, 130, 246, 0.9)',
  accentGlow: 'rgba(59, 130, 246, 0.3)',
};

interface GlassDatePickerProps {
  onDateSelect: (date: Date) => void;
  initialDate?: Date;
  minimumDate?: Date;
}

const GlassDatePicker: React.FC<GlassDatePickerProps> = ({
  onDateSelect,
  initialDate = new Date(),
  minimumDate = new Date(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => dayjs(initialDate));
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isVisible, setIsVisible] = useState(false);

  // Generate calendar days for current month
  const generateCalendarDays = useCallback((month: dayjs.Dayjs) => {
    const daysInMonth = month.daysInMonth();
    const firstDayOfMonth = month.startOf('month').day();
    const today = dayjs();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = month.date(i);
      days.push({
        date: currentDate.toDate(),
        dayNumber: i,
        isToday: currentDate.isSame(today, 'day'),
        isCurrentMonth: true,
        isPast: currentDate.isBefore(today, 'day'),
      });
    }
    
    // Fill remaining cells to complete 6 rows (42 cells)
    while (days.length < 42) {
      days.push(null);
    }
    
    return days;
  }, []);

  const calendarDays = useMemo(() => 
    generateCalendarDays(currentMonth), [currentMonth]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prev => prev.subtract(1, 'month'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prev => prev.add(1, 'month'));
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
    setIsVisible(false);
  }, [onDateSelect]);

  const handleQuickSelect = useCallback((days: number) => {
    const futureDate = dayjs().add(days, 'day').toDate();
    handleDateSelect(futureDate);
  }, [handleDateSelect]);

  const open = useCallback(() => {
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
  }, []);

  interface CalendarDay {
  date: Date;
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  isPast: boolean;
}

const renderCalendarDay = useCallback(({ item }: { item: CalendarDay | null }) => {
  if (!item) {
    return (
      <View style={{ width: CELL_SIZE, height: CELL_SIZE }} />
      );
    }

    const { date, dayNumber, isToday, isCurrentMonth, isPast } = item;
    const isSelected = selectedDate && dayjs(date).isSame(selectedDate, 'day');
    
    return (
      <TouchableOpacity
        onPress={() => !isPast && handleDateSelect(date)}
        disabled={isPast}
        style={[
          {
            width: CELL_SIZE,
            height: CELL_SIZE,
            borderRadius: 8,
            backgroundColor: isSelected 
              ? GLASS_TOKENS.accent 
              : isToday 
                ? GLASS_TOKENS.background 
                : 'transparent',
            borderWidth: isSelected ? 2 : 1,
            borderColor: isSelected 
              ? GLASS_TOKENS.accent 
              : GLASS_TOKENS.border,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: isSelected ? GLASS_TOKENS.accentGlow : 'transparent',
            shadowOffset: { width: 0, height: isSelected ? 4 : 0 },
            shadowOpacity: isSelected ? 0.3 : 0,
            elevation: isSelected ? 8 : 0,
          },
          isPast && { opacity: 0.4 }
        ]}
      >
        <Text
          style={[
            {
              fontSize: 16,
              fontWeight: isToday ? '700' : '500',
              color: isSelected 
                ? 'white' 
                : isToday 
                  ? GLASS_TOKENS.textPrimary 
                  : GLASS_TOKENS.textSecondary,
            }
          ]}
        >
          {dayNumber}
        </Text>
        
        {isToday && (
          <View
            style={{
              position: 'absolute',
              bottom: 2,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: GLASS_TOKENS.accent,
            }}
          />
        )}
      </TouchableOpacity>
    );
  }, [handleDateSelect, selectedDate]);

  const renderQuickSelectButton = useCallback((days: number, label: string, color: string) => (
    <TouchableOpacity
      onPress={() => handleQuickSelect(days)}
      style={{
        backgroundColor: GLASS_TOKENS.accent,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: GLASS_TOKENS.accentGlow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        elevation: 4,
      }}
    >
      <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
        {label}
      </Text>
    </TouchableOpacity>
  ), [handleQuickSelect]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Backdrop */}
      <BlurView
        intensity={20}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {/* Glass Modal Container */}
          <Animated.View
            style={{
              backgroundColor: GLASS_TOKENS.background,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: GLASS_TOKENS.border,
              width: CALENDAR_WIDTH + 24,
              maxWidth: '90%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: GLASS_TOKENS.border,
              }}
            >
              <TouchableOpacity onPress={handlePreviousMonth}>
                <ChevronLeft size={20} color={GLASS_TOKENS.textSecondary} />
              </TouchableOpacity>
              
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: GLASS_TOKENS.textPrimary,
                }}
              >
                {currentMonth.format('MMMM YYYY')}
              </Text>
              
              <TouchableOpacity onPress={handleNextMonth}>
                <ChevronRight size={20} color={GLASS_TOKENS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Calendar Grid */}
            <View style={{ paddingHorizontal: 8 }}>
              <FlatList
                data={calendarDays}
                numColumns={7}
                keyExtractor={(item, index) => index?.toString() || ''}
                renderItem={renderCalendarDay}
              />
            </View>

            {/* Quick Select Buttons */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 20,
                gap: 12,
              }}
            >
              {renderQuickSelectButton(3, '+3 Days', '#10B981')}
              {renderQuickSelectButton(7, '+1 Week', '#059669')}
              {renderQuickSelectButton(30, '+1 Month', '#8B5CF6')}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={close}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: GLASS_TOKENS.background,
                borderWidth: 1,
                borderColor: GLASS_TOKENS.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} color={GLASS_TOKENS.textSecondary} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </BlurView>
    </View>
  );
};

export default GlassDatePicker;
