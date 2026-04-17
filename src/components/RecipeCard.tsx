import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, Zap as Calories } from '@/src/utils/icon-interop';
import { THEME } from '../theme/theme';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: string;
  calories: number;
  matchPercentage: number;
  ingredientsMatched: number;
  totalIngredients: number;
  tags: string[];
  onPress: () => void;
}

export function RecipeCard({
  id,
  title,
  image,
  rating,
  difficulty,
  cookTime,
  calories,
  matchPercentage,
  ingredientsMatched,
  totalIngredients,
  tags,
  onPress,
}: RecipeCardProps) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy':
        return THEME.status.fresh;
      case 'Medium':
        return THEME.status.expiring;
      case 'Hard':
        return THEME.status.expired;
      default:
        return THEME.status.fresh;
    }
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={12} color={THEME.accent} fill={THEME.accent} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={12} color={THEME.accent} fill="none" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={12} color={THEME.border.default} fill="none" />
      );
    }

    return stars;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: THEME.surface,
        borderRadius: THEME.radius.card,
        marginHorizontal: THEME.spacing.md,
        marginVertical: THEME.spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {/* Recipe Image */}
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: image }}
          style={{
            width: '100%',
            height: 200,
            borderTopLeftRadius: THEME.radius.card,
            borderTopRightRadius: THEME.radius.card,
          }}
          resizeMode="cover"
        />
        
        {/* Difficulty Badge */}
        <View
          style={{
            position: 'absolute',
            top: THEME.spacing.md,
            right: THEME.spacing.md,
            backgroundColor: getDifficultyColor(),
            borderRadius: THEME.radius.button / 2,
            paddingHorizontal: THEME.spacing.sm,
            paddingVertical: THEME.spacing.xs,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 'bold',
              fontFamily: 'SpaceMono',
            }}
          >
            {difficulty}
          </Text>
        </View>
      </View>

      {/* Recipe Details */}
      <View style={{ padding: THEME.spacing.lg }}>
        {/* Title and Rating */}
        <View style={{ marginBottom: THEME.spacing.md }}>
          <Text
            style={{
              color: THEME.text.primary,
              fontSize: 18,
              fontWeight: 'bold',
              fontFamily: 'SpaceMono',
              marginBottom: THEME.spacing.xs,
            }}
          >
            {title}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', marginRight: THEME.spacing.md }}>
              {renderStars()}
            </View>
            <Text
              style={{
                color: THEME.text.secondary,
                fontSize: 14,
                fontFamily: 'SpaceMono',
              }}
            >
              {rating.toFixed(1)} - {difficulty}
            </Text>
          </View>
        </View>

        {/* Cook Time and Calories */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: THEME.spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Clock size={16} color={THEME.text.secondary} style={{ marginRight: THEME.spacing.xs }} />
            <Text
              style={{
                color: THEME.text.secondary,
                fontSize: 14,
                fontFamily: 'SpaceMono',
              }}
            >
              {cookTime}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Calories size={16} color={THEME.text.secondary} style={{ marginRight: THEME.spacing.xs }} />
            <Text
              style={{
                color: THEME.text.secondary,
                fontSize: 14,
                fontFamily: 'SpaceMono',
              }}
            >
              {calories} cal
            </Text>
          </View>
        </View>

        {/* Ingredient Match Progress */}
        <View style={{ marginBottom: THEME.spacing.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: THEME.spacing.xs,
            }}
          >
            <Text
              style={{
                color: THEME.text.secondary,
                fontSize: 12,
                fontFamily: 'SpaceMono',
              }}
            >
              You have {ingredientsMatched} of {totalIngredients} ingredients
            </Text>
            <Text
              style={{
                color: THEME.accent,
                fontSize: 12,
                fontWeight: 'bold',
                fontFamily: 'SpaceMono',
              }}
            >
              {matchPercentage}% match
            </Text>
          </View>
          
          <View
            style={{
              height: 4,
              backgroundColor: THEME.border.subtle,
              borderRadius: 2,
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${matchPercentage}%`,
                backgroundColor: THEME.accent,
                borderRadius: 2,
              }}
            />
          </View>
        </View>

        {/* Tags */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {tags.map((tag, index) => (
            <View
              key={index}
              style={{
                backgroundColor: THEME.border.subtle,
                borderRadius: THEME.radius.button / 2,
                paddingHorizontal: THEME.spacing.sm,
                paddingVertical: THEME.spacing.xs,
                marginRight: THEME.spacing.sm,
                marginBottom: THEME.spacing.xs,
              }}
            >
              <Text
                style={{
                  color: THEME.text.secondary,
                  fontSize: 12,
                  fontFamily: 'SpaceMono',
                }}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
