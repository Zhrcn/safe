import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProviders, fetchPharmacists } from '../../../features/providers/providersSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomTabBar from '../../../components/ui/CustomTabBar';
import CustomDrawer from '../../../components/ui/CustomDrawer';

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
      <View style={starStyles.noRatingWrap}>
        <MaterialCommunityIcons name="star-outline" size={20} color="#d1d5db" />
        <Text style={starStyles.noRatingText}>No ratings</Text>
      </View>
    );
  }
  return (
    <View style={starStyles.ratingWrap}>
      <MaterialCommunityIcons name="star" size={20} color="#fbbf24" />
      <Text style={starStyles.ratingText}>{rating.toFixed(1)}</Text>
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

function ProviderCard({ item, activeTab, index }) {
  const provider = normalizeProvider(item, activeTab);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      delay: index * 40,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [fadeAnim, index]);
  const isTopRated = provider.rating >= 4.5;

  return (
    <Animated.View
      style={[
        cardStyles.card,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={cardStyles.row}>
        <View style={cardStyles.avatarSection}>
          {provider.avatar ? (
            <Image
              source={{ uri: provider.avatar }}
              style={cardStyles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <View style={cardStyles.avatarFallback}>
              <Text style={cardStyles.avatarText}>{getInitials(provider.name)}</Text>
            </View>
          )}
          {isTopRated && (
            <View style={cardStyles.topRatedBadge}>
              <MaterialCommunityIcons name="crown" size={14} color="#fbbf24" />
              <Text style={cardStyles.topRatedText}>Top Rated</Text>
            </View>
          )}
        </View>
        <View style={cardStyles.infoSection}>
          <Text style={cardStyles.name}>{provider.name}</Text>
          <Text style={cardStyles.specialty}>{provider.specialty}</Text>
          <View style={cardStyles.metaRow}>
            {activeTab === 'doctors' && provider.hospital && (
              <View style={cardStyles.metaItem}>
                <MaterialCommunityIcons name="hospital-building" size={15} color="#2563eb" />
                <Text style={cardStyles.metaText}>{provider.hospital}</Text>
              </View>
            )}
            {activeTab === 'pharmacists' && provider.address && (
              <View style={cardStyles.metaItem}>
                <MaterialCommunityIcons name="map-marker" size={15} color="#2563eb" />
                <Text style={cardStyles.metaText}>{provider.address}</Text>
              </View>
            )}
            {provider.yearsExperience && (
              <View style={cardStyles.metaItem}>
                <MaterialCommunityIcons name="briefcase" size={15} color="#2563eb" />
                <Text style={cardStyles.metaText}>{provider.yearsExperience} yrs</Text>
              </View>
            )}
          </View>
        </View>
        <View style={cardStyles.ratingSection}>
          <StarRating rating={provider.rating} />
        </View>
      </View>
      <View style={cardStyles.actionsRow}>
        <TouchableOpacity style={cardStyles.primaryBtn}>
          <MaterialCommunityIcons
            name={activeTab === 'doctors' ? 'calendar-check' : 'account-plus'}
            size={18}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={cardStyles.primaryBtnText}>
            {activeTab === 'doctors' ? 'Book' : 'Ask'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.secondaryBtn}>
          <MaterialCommunityIcons name="message" size={18} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function TabBar({ activeTab, setActiveTab }) {
  return (
    <View style={tabBarStyles.tabBar}>
      <TouchableOpacity
        style={[
          tabBarStyles.tabBtn,
          activeTab === 'doctors' && tabBarStyles.tabBtnActive,
        ]}
        onPress={() => setActiveTab('doctors')}
      >
        <MaterialCommunityIcons name="doctor" size={18} color={activeTab === 'doctors' ? "#2563eb" : "#6b7280"} style={{ marginRight: 6 }} />
        <Text style={[tabBarStyles.tabBtnText, activeTab === 'doctors' && tabBarStyles.tabBtnTextActive]}>Doctors</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          tabBarStyles.tabBtn,
          activeTab === 'pharmacists' && tabBarStyles.tabBtnActive,
        ]}
        onPress={() => setActiveTab('pharmacists')}
      >
        <MaterialCommunityIcons name="pill" size={18} color={activeTab === 'pharmacists' ? "#2563eb" : "#6b7280"} style={{ marginRight: 6 }} />
        <Text style={[tabBarStyles.tabBtnText, activeTab === 'pharmacists' && tabBarStyles.tabBtnTextActive]}>Pharmacists</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ProvidersScreen() {
  const dispatch = useDispatch();
  const { list: doctors, loading, error, pharmacists, loadingPharmacists, errorPharmacists } = useSelector((state) => state.providers);
  const [activeTab, setActiveTab] = useState('doctors');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'doctors') dispatch(fetchProviders());
    else if (activeTab === 'pharmacists') dispatch(fetchPharmacists());
  }, [dispatch, activeTab]);

  const filterAndSort = (data) => {
    let filtered = data.filter(item => {
      const provider = normalizeProvider(item, activeTab);
      const matchesSearch =
        (provider.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (provider.specialty || '').toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
    if (sortBy === 'name')
      filtered.sort((a, b) =>
        (normalizeProvider(a, activeTab).name || '').localeCompare(
          normalizeProvider(b, activeTab).name || ''
        )
      );
    else if (sortBy === 'rating')
      filtered.sort(
        (a, b) =>
          (normalizeProvider(b, activeTab).rating || 0) -
          (normalizeProvider(a, activeTab).rating || 0)
      );
    else if (sortBy === 'experience')
      filtered.sort(
        (a, b) =>
          (normalizeProvider(b, activeTab).yearsExperience || 0) -
          (normalizeProvider(a, activeTab).yearsExperience || 0)
      );
    return filtered;
  };

  const data =
    activeTab === 'doctors'
      ? filterAndSort(doctors || [])
      : filterAndSort(pharmacists || []);
  const isLoading =
    activeTab === 'doctors' ? loading : loadingPharmacists;
  const err = activeTab === 'doctors' ? error : errorPharmacists;

  return (
    <View style={screenStyles.container}>
      <CustomHeader onMenuPress={() => setDrawerOpen(true)} />
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={screenStyles.searchSortWrap}>
        <View style={screenStyles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search by name or specialty"
            value={search}
            onChangeText={setSearch}
            style={screenStyles.searchInput}
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
          />
        </View>
        <View style={screenStyles.sortBar}>
          <TouchableOpacity onPress={() => setSortBy('rating')} style={screenStyles.sortBtn}>
            <Text style={[screenStyles.sortBtnText, sortBy === 'rating' && screenStyles.sortBtnTextActive]}>Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('name')} style={screenStyles.sortBtn}>
            <Text style={[screenStyles.sortBtnText, sortBy === 'name' && screenStyles.sortBtnTextActive]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('experience')} style={screenStyles.sortBtn}>
            <Text style={[screenStyles.sortBtnText, sortBy === 'experience' && screenStyles.sortBtnTextActive]}>Experience</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={screenStyles.divider} />
      <View style={screenStyles.listWrap}>
        {isLoading ? (
          <View style={screenStyles.loadingWrap}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={screenStyles.loadingText}>Loading providers...</Text>
          </View>
        ) : err ? (
          <Text style={screenStyles.errorText}>{err}</Text>
        ) : (
          <FlatList
            contentContainerStyle={screenStyles.flatListContent}
            data={data}
            keyExtractor={item => item.id?.toString() || item._id?.toString()}
            renderItem={({ item, index }) => (
              <ProviderCard item={item} activeTab={activeTab} index={index} />
            )}
            ListEmptyComponent={
              <View style={screenStyles.emptyWrap}>
                <MaterialCommunityIcons name="emoticon-sad-outline" size={48} color="#9ca3af" />
                <Text style={screenStyles.emptyText}>No providers found.</Text>
                <Text style={screenStyles.emptyHint}>Try adjusting your search.</Text>
              </View>
            }
          />
        )}
      </View>
      <CustomTabBar />
    </View>
  );
}

// Hide the default header for this page
ProvidersScreen.options = {
  headerShown: false,
};

// --- Styles ---

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  searchSortWrap: {
    paddingHorizontal: 18,
    paddingTop: 10,
    backgroundColor: '#f6f8fa',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
    paddingVertical: 2,
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sortBtn: {
    marginRight: 18,
  },
  sortBtnText: {
    color: '#6b7280',
    fontWeight: '500',
    fontSize: 15,
  },
  sortBtnTextActive: {
    color: '#2563eb',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 18,
    marginBottom: 8,
  },
  listWrap: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  flatListContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  loadingText: {
    color: '#2563eb',
    marginTop: 12,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 32,
    textAlign: 'center',
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 8,
  },
  emptyHint: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});

const tabBarStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 14,
    padding: 3,
    marginHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: 'white',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabBtnText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabBtnTextActive: {
    color: '#2563eb',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginRight: 14,
    width: 56,
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#3730a3',
    fontWeight: 'bold',
    fontSize: 20,
  },
  topRatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 1,
    marginTop: 4,
    alignSelf: 'center',
  },
  topRatedText: {
    color: '#b45309',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 3,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#111827',
    marginBottom: 1,
  },
  specialty: {
    color: '#2563eb',
    fontSize: 14,
    marginBottom: 2,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  metaText: {
    color: '#6b7280',
    fontSize: 12,
    marginLeft: 3,
  },
  ratingSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 7,
    paddingVertical: 9,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 8,
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 2,
  },
  secondaryBtn: {
    backgroundColor: '#e0e7ff',
    borderRadius: 7,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
});

const starStyles = StyleSheet.create({
  noRatingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRatingText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 1,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: '#b45309',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 3,
  },
});
