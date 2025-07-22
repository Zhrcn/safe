import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Animated, Easing, ScrollView, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProviders, fetchPharmacists } from '../../../features/providers/providersSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const TABS = [
  { key: 'doctors', label: 'Doctors', icon: 'doctor' },
  { key: 'pharmacists', label: 'Pharmacists', icon: 'pill' },
];

const windowWidth = Dimensions.get('window').width;

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

function StarRating({ rating }) {
  if (!rating || rating <= 0) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons name="star-outline" size={22} color="#d1d5db" />
        <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>No ratings yet</Text>
      </View>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialCommunityIcons name="star" size={22} color="#fbbf24" style={{ marginRight: 4 }} />
      <Text style={{ color: '#b45309', fontWeight: 'bold', fontSize: 14 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function normalizeProvider(item, activeTab) {
  let rating = 0;
  if (item.rating !== undefined && item.rating !== null) {
    rating = parseFloat(item.rating);
  } else if (item.user && item.user.rating !== undefined && item.user.rating !== null) {
    rating = parseFloat(item.user.rating);
  }
  if (activeTab === 'doctors') {
    return {
      name: item.name || (item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() : ''),
      specialty: item.specialization || 'N/A',
      rating,
      yearsExperience: item.yearsExperience,
      hospital: item.hospital,
      avatar: item.user?.profileImage || item.profileImage,
      specialties: item.specialties || [],
      location: item.hospital,
    };
  } else {
    return {
      name: item.name || item.pharmacyName || (item.user ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() : ''),
      specialty: (item.specialties && item.specialties.length > 0) ? item.specialties.join(', ') : (item.pharmacyName || 'N/A'),
      rating,
      yearsExperience: item.yearsExperience,
      address: item.address,
      avatar: item.user?.profileImage || item.profileImage,
      specialties: item.specialties || [],
      location: item.address,
    };
  }
}

function FilterChips({ chips, selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll} contentContainerStyle={{ paddingHorizontal: 8 }}>
      {chips.map((chip, idx) => (
        <TouchableOpacity
          key={chip}
          style={[styles.chip, selected === chip && styles.chipSelected]}
          onPress={() => onSelect(chip)}
        >
          <Text style={[styles.chipText, selected === chip && styles.chipTextSelected]}>{chip}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function ProviderCard({ item, activeTab, index }) {
  const provider = normalizeProvider(item, activeTab);
  console.log('ProviderCard raw item:', item);
  console.log('ProviderCard normalized:', provider);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 60,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [fadeAnim, index]);
  const isTopRated = provider.rating >= 4.5;
  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}> 
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {provider.avatar ? (
              <View style={styles.avatarImgFallback}><Text style={styles.avatarText}>{getInitials(provider.name)}</Text></View>
            ) : (
              <Text style={styles.avatarText}>{getInitials(provider.name)}</Text>
            )}
          </View>
          {isTopRated && (
            <View style={styles.topRatedBadge}>
              <MaterialCommunityIcons name="crown" size={16} color="#fbbf24" />
              <Text style={styles.topRatedText}>Top Rated</Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.specialty}>{provider.specialty}</Text>
          <View style={styles.metaRow}>
            {activeTab === 'doctors' && provider.hospital && (
              <><MaterialCommunityIcons name="map-marker" size={15} color="#2563eb" style={{ marginRight: 4 }} /><Text style={styles.metaText}>{provider.hospital}</Text></>
            )}
            {activeTab === 'pharmacists' && provider.address && (
              <><MaterialCommunityIcons name="map-marker" size={15} color="#2563eb" style={{ marginRight: 4 }} /><Text style={styles.metaText}>{provider.address}</Text></>
            )}
            {provider.yearsExperience && (
              <><MaterialCommunityIcons name="briefcase" size={15} color="#2563eb" style={{ marginLeft: 8, marginRight: 4 }} /><Text style={styles.metaText}>{provider.yearsExperience} yrs</Text></>
            )}
          </View>
        </View>
        <View style={styles.ratingBox}>
          <StarRating rating={provider.rating} />
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialCommunityIcons name={activeTab === 'doctors' ? 'calendar-check' : 'account-plus'} size={18} color="white" style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnText}>{activeTab === 'doctors' ? 'Book' : 'Ask for Medicine'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
          <MaterialCommunityIcons name="message" size={18} color="#2563eb" style={{ marginRight: 6 }} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function ProvidersScreen() {
  const dispatch = useDispatch();
  const { list: doctors, loading, error, pharmacists, loadingPharmacists, errorPharmacists } = useSelector((state) => state.providers);
  const [activeTab, setActiveTab] = useState('doctors');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    if (activeTab === 'doctors') dispatch(fetchProviders());
    else if (activeTab === 'pharmacists') dispatch(fetchPharmacists());
  }, [dispatch, activeTab]);

  const filterAndSort = (data) => {
    let filtered = data.filter(item => {
      const provider = normalizeProvider(item, activeTab);
      const matchesSearch = (provider.name || '').toLowerCase().includes(search.toLowerCase()) || (provider.specialty || '').toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
    if (sortBy === 'name') filtered.sort((a, b) => (normalizeProvider(a, activeTab).name || '').localeCompare(normalizeProvider(b, activeTab).name || ''));
    else if (sortBy === 'rating') filtered.sort((a, b) => (normalizeProvider(b, activeTab).rating || 0) - (normalizeProvider(a, activeTab).rating || 0));
    else if (sortBy === 'experience') filtered.sort((a, b) => (normalizeProvider(b, activeTab).yearsExperience || 0) - (normalizeProvider(a, activeTab).yearsExperience || 0));
    return filtered;
  };

  const data = activeTab === 'doctors' ? filterAndSort(doctors || []) : filterAndSort(pharmacists || []);
  const isLoading = activeTab === 'doctors' ? loading : loadingPharmacists;
  const err = activeTab === 'doctors' ? error : errorPharmacists;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={tab.icon} size={20} color={activeTab === tab.key ? '#2563eb' : '#6b7280'} style={{ marginRight: 6 }} />
            <Text style={[styles.tabBtnText, activeTab === tab.key && styles.tabBtnTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Search */}
      <View style={styles.floatingSearchWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by name or specialty..."
          value={search}
          onChangeText={setSearch}
          style={styles.floatingSearchInput}
          placeholderTextColor="#9ca3af"
        />
      </View>
      {/* Sort */}
      <View style={styles.sortBar}>
        <TouchableOpacity onPress={() => setSortBy('rating')} style={styles.sortBtn}><Text style={[styles.sortBtnText, sortBy === 'rating' && styles.sortBtnTextActive]}>Rating</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('name')} style={styles.sortBtn}><Text style={[styles.sortBtnText, sortBy === 'name' && styles.sortBtnTextActive]}>Name</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('experience')} style={styles.sortBtn}><Text style={[styles.sortBtnText, sortBy === 'experience' && styles.sortBtnTextActive]}>Experience</Text></TouchableOpacity>
      </View>
      <View style={styles.divider} />
      {/* List */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ color: '#2563eb', marginTop: 12, fontWeight: 'bold' }}>Loading providers...</Text>
        </View>
      ) : err ? (
        <Text style={{ color: 'red', marginTop: 32, textAlign: 'center' }}>{err}</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingTop: 0, paddingBottom: 32 }}
          data={data}
          keyExtractor={item => item.id?.toString() || item._id?.toString()}
          renderItem={({ item, index }) => <ProviderCard item={item} activeTab={activeTab} index={index} />}
          ListEmptyComponent={<View style={{ alignItems: 'center', marginTop: 48 }}><MaterialCommunityIcons name="emoticon-sad-outline" size={48} color="#9ca3af" /><Text style={{ color: '#6b7280', fontSize: 18, marginTop: 8, marginBottom: 8 }}>No providers found.</Text><Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Try adjusting your search.</Text></View>}
        />
      )}
    </View>
  );
}

// Hide the default header for this page
export const unstable_settings = { initialRouteName: undefined };

ProvidersScreen.options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginTop: 36,
    marginBottom: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: 'white',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tabBtnText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabBtnTextActive: {
    color: '#2563eb',
  },
  floatingSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    width: windowWidth - 40,
    position: 'absolute',
    bottom: -28,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  floatingSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  sortBar: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  sortBtn: {
    marginRight: 16,
  },
  sortBtnText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sortBtnTextActive: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrap: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImgFallback: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#3730a3',
    fontWeight: 'bold',
    fontSize: 22,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    alignSelf: 'center',
  },
  topRatedText: {
    color: '#b45309',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 2,
  },
  specialty: {
    color: '#2563eb',
    fontSize: 15,
    marginBottom: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  metaText: {
    color: '#6b7280',
    fontSize: 13,
    marginRight: 8,
  },
  ratingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryBtn: {
    backgroundColor: '#e0e7ff',
    marginRight: 0,
  },
  actionBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
