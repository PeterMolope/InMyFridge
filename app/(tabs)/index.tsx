import { FoodItem, useFridgeStore } from "@/src/context/fridgeStore";
import { router } from "expo-router";
import { AlertTriangle, CheckCircle, Clock, Filter, Plus, Search } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Plus, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Search, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Filter, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(Clock, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(AlertTriangle, { className: { target: 'style', nativeStyleToProp: { color: true } } });
cssInterop(CheckCircle, { className: { target: 'style', nativeStyleToProp: { color: true } } });

const mockItems: FoodItem[] = [
  {
    id: '1',
    name: 'Fresh Milk',
    category: 'Dairy',
    quantity: 1,
    unit: 'gallon',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Chicken Breast',
    category: 'Meat',
    quantity: 2,
    unit: 'lbs',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Greek Yogurt',
    category: 'Dairy',
    quantity: 3,
    unit: 'cups',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Avocados',
    category: 'Produce',
    quantity: 4,
    unit: 'pieces',
    image: 'https://images.unsplash.com/photo-1523049673856-3888e81c8b31?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    name: 'Cheddar Cheese',
    category: 'Dairy',
    quantity: 1,
    unit: 'block',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    name: 'Fresh Eggs',
    category: 'Dairy',
    quantity: 12,
    unit: 'pieces',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=60',
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  },
];

export default function FridgeHomeScreen() {
  const { items, selectedItems, toggleSelectItem } = useFridgeStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'fresh' | 'expiring-soon' | 'expired'>('all');
  
  // Use mock items if store is empty
  const displayItems = items.length > 0 ? items : mockItems;

  const getItemStatus = (item: FoodItem) => {
    if (!item.expirationDate) return 'fresh';
    
    // Convert string to Date if needed
    const expiryDate = typeof item.expirationDate === 'string' 
      ? new Date(item.expirationDate) 
      : item.expirationDate;
    
    if (!(expiryDate instanceof Date) || isNaN(expiryDate.getTime())) return 'fresh';
    
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expired';
    if (diffDays <= 3) return 'expiring-soon';
    return 'fresh';
  };

  const getDaysUntilExpiry = (item: FoodItem) => {
    if (!item.expirationDate) return 999;
    
    // Convert string to Date if needed
    const expiryDate = typeof item.expirationDate === 'string' 
      ? new Date(item.expirationDate) 
      : item.expirationDate;
    
    if (!(expiryDate instanceof Date) || isNaN(expiryDate.getTime())) return 999;
    
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredItems = displayItems.filter(item => {
    const status = getItemStatus(item);
    return selectedFilter === 'all' || status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'bg-green-500';
      case 'expiring-soon':
        return 'bg-orange-500';
      case 'expired':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'fresh':
        return 'Fresh';
      case 'expiring-soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const stats = {
    total: displayItems.length,
    expiringSoon: displayItems.filter(i => getItemStatus(i) === 'expiring-soon').length,
    expired: displayItems.filter(i => getItemStatus(i) === 'expired').length,
  };

  const handleGetRecipes = () => {
    if (selectedItems.length === 0) {
      alert("Please select some ingredients first");
      return;
    }
    router.push({ pathname: "/(tabs)/recipes" });
  };

  return (
    <SafeAreaView 
      style={{
        flex: 1,
        backgroundColor: '#050505'
      }}
      edges={['top', 'left', 'right']}
    >
      {/* Header */}
      <View style={{
        paddingHorizontal: 24,
        paddingVertical: 16
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24
        }}>
          <View>
            <Text style={{ color: '#39FF14', opacity: 0.6, fontSize: 14 }}>Welcome back,</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: -1 }}>My Fridge</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{
          flexDirection: 'row',
          gap: 12,
          marginBottom: 24
        }}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(57, 255, 20, 0.3)'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#39FF14'
              }} />
              <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>Total Items</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>{stats.total}</Text>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(57, 255, 20, 0.3)'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f97316'
              }} />
              <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>Expiring</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>{stats.expiringSoon}</Text>
          </View>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: 'rgba(57, 255, 20, 0.3)'
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8
            }}>
              <View style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#ef4444'
              }} />
              <Text style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.6)' }}>Expired</Text>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff' }}>{stats.expired}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 12,
            borderWidth: 1,
            borderColor: 'rgba(57, 255, 20, 0.3)'
          }}>
            <Search color="rgba(255, 255, 255, 0.6)" size={20} />
            <Text style={{ color: 'rgba(255, 255, 255, 0.6)', flex: 1 }}>Search items...</Text>
          </View>
          <TouchableOpacity 
            style={{
              backgroundColor: 'rgba(26, 26, 26, 0.8)',
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: 'rgba(57, 255, 20, 0.3)'
            }}
          >
            <Filter color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={{ marginBottom: 16 }}
          contentContainerStyle={{ gap: 8 }}
        >
          <View style={{
            flexDirection: 'row',
            gap: 8
          }}>
            {(['all', 'fresh', 'expiring-soon', 'expired'] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedFilter === filter ? '#39FF14' : 'rgba(26, 26, 26, 0.8)',
                  borderWidth: 1,
                  borderColor: 'rgba(57, 255, 20, 0.3)'
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: selectedFilter === filter ? '#000000' : '#ffffff'
                  }}
                >
                  {filter === 'expiring-soon' ? 'Expiring Soon' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Items Grid */}
      <ScrollView
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          paddingBottom: 128, 
          gap: 12 
        }}
      >
        {filteredItems.map((item) => {
          const status = getItemStatus(item);
          const daysUntilExpiry = getDaysUntilExpiry(item);
          
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleSelectItem(item.id)}
              style={{
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                borderRadius: 16,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: selectedItems.includes(item.id) ? '#39FF14' : 'rgba(57, 255, 20, 0.3)'
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={{ uri: item.image || 'https://via.placeholder.com/100' }}
                  style={{ width: 96, height: 96 }}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, padding: 16 }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 8
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 4 }}>
                        {item.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                        {item.quantity} {item.unit} · {item.category}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 20,
                        backgroundColor: status === 'fresh' ? '#22c55e' : status === 'expiring-soon' ? '#f97316' : '#ef4444'
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '500', color: '#ffffff' }}>
                        {getStatusText(status)}
                      </Text>
                    </View>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginTop: 8
                  }}>
                    {status === 'fresh' ? (
                      <CheckCircle color="#22c55e" size={16} />
                    ) : status === 'expiring-soon' ? (
                      <Clock color="#f97316" size={16} />
                    ) : (
                      <AlertTriangle color="#ef4444" size={16} />
                    )}
                    <Text style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {status === 'fresh'
                        ? `Expires in ${daysUntilExpiry} days` 
                        : status === 'expiring-soon'
                        ? `Expires in ${daysUntilExpiry} days` 
                        : 'Expired'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {selectedItems.length > 0 && (
          <View style={{
            backgroundColor: '#39FF14',
            borderRadius: 16,
            padding: 16,
            marginTop: 16
          }}>
            <Text style={{ color: '#000000', fontWeight: '600', marginBottom: 8 }}>
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </Text>
            <Text style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: 14, marginBottom: 12 }}>
              Find recipes with these ingredients
            </Text>
            <TouchableOpacity 
              onPress={handleGetRecipes}
              style={{
                backgroundColor: '#000000',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#39FF14', fontWeight: '600' }}>Generate Recipes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        onPress={() => router.push({ pathname: "/add-item" })}
        style={{
          position: 'absolute',
          bottom: 128,
          right: 24,
          backgroundColor: '#39FF14',
          borderRadius: 999,
          padding: 16,
          shadowColor: '#39FF14',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8
        }}
      >
        <Plus color="#000000" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
