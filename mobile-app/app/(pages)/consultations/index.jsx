import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert as RNAlert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchConsultations,
  addConsultation,
  deleteConsultation,
  sendFollowUpQuestion,
} from '../../../features/consultations/consultationsSlice';
import { fetchProviders } from '../../../features/providers/providersSlice';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

function statusColor(status) {
  switch (status) {
    case 'scheduled': return '#60a5fa';
    case 'completed': return '#4ade80';
    case 'cancelled': return '#f87171';
    case 'pending': return '#facc15';
    default: return '#e5e7eb';
  }
}

function typeLabel(type) {
  switch ((type || '').toLowerCase()) {
    case 'video': return 'Video Call';
    case 'chat': return 'Chat';
    case 'phone': return 'Phone Call';
    default: return type;
  }
}

function ConsultationCard({ item, onView, onDelete, onContinueChat }) {
  const doctorName = item.doctor?.user
    ? `${item.doctor.user.firstName || ''} ${item.doctor.user.lastName || ''}`.trim()
    : item.doctorName || 'Doctor';
  const doctorSpecialty = item.doctor?.specialization || item.doctorSpecialty || '';
  const initials = getInitials(doctorName);
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onView(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          {!!doctorSpecialty && (
            <Text style={styles.doctorSpecialty}>{doctorSpecialty}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) }]}> 
          <Text style={styles.statusText}>{item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <MaterialCommunityIcons name={item.type === 'video' ? 'video' : item.type === 'chat' ? 'chat' : 'phone'} size={16} color="#2563eb" />
        <Text style={styles.typeText}>{typeLabel(item.type)} Consultation</Text>
      </View>
      <View style={styles.qaBox}>
        <Text style={styles.qaLabel}>Question:</Text>
        <Text style={styles.qaText}>{item.question || 'No question provided.'}</Text>
      </View>
      <View style={styles.qaBox}>
        <Text style={styles.qaLabel}>Answer:</Text>
        <Text style={styles.qaText}>{item.answer || <Text style={{ fontStyle: 'italic', color: '#facc15' }}>No answer yet.</Text>}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onView(item)}>
          <MaterialCommunityIcons name="eye" size={18} color="#2563eb" />
          <Text style={styles.actionBtnText}>{item.status === 'pending' ? 'Continue Chat' : 'View'}</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onContinueChat(item)}>
            <MaterialCommunityIcons name="message-reply" size={18} color="#22c55e" />
            <Text style={[styles.actionBtnText, { color: '#22c55e' }]}>Follow Up</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item)}>
          <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
          <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function ConsultationsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const { list, loading, error } = useSelector((state) => state.consultations);
  const { list: doctors, loading: loadingDoctors, error: errorDoctors } = useSelector((state) => state.providers);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [question, setQuestion] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [alert, setAlert] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchConsultations());
    dispatch(fetchProviders());
  }, [dispatch]);

  const handleRefresh = () => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchConsultations()),
      dispatch(fetchProviders()),
    ]).finally(() => setRefreshing(false));
  };

  const handleAddConsultation = async () => {
    if (!selectedDoctor || !question.trim()) return;
    try {
      await dispatch(addConsultation({ doctorId: selectedDoctor, question })).unwrap();
      setShowNewModal(false);
      setQuestion('');
      setSelectedDoctor('');
      setAlert({ type: 'success', message: 'Consultation submitted successfully.' });
      dispatch(fetchConsultations());
    } catch (e) {
      setAlert({ type: 'error', message: e?.message || 'Failed to submit consultation.' });
    }
  };

  const handleDeleteConsultation = (item) => {
    RNAlert.alert(
      'Delete Consultation',
      'Are you sure you want to delete this consultation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteConsultation(item._id)).unwrap();
              setAlert({ type: 'success', message: 'Consultation deleted.' });
              dispatch(fetchConsultations());
            } catch (e) {
              setAlert({ type: 'error', message: e?.message || 'Failed to delete.' });
            }
          }
        }
      ]
    );
  };

  const handleContinueChat = (item) => {
    setSelectedConsultation(item);
    setShowFollowUpModal(true);
    setFollowUpQuestion('');
  };

  const handleSendFollowUp = async () => {
    if (!followUpQuestion.trim() || !selectedConsultation) return;
    try {
      await dispatch(sendFollowUpQuestion({ consultationId: selectedConsultation._id, question: followUpQuestion })).unwrap();
      setShowFollowUpModal(false);
      setFollowUpQuestion('');
      setAlert({ type: 'success', message: 'Follow-up question sent.' });
      dispatch(fetchConsultations());
    } catch (e) {
      setAlert({ type: 'error', message: e?.message || 'Failed to send follow-up.' });
    }
  };

  const handleViewConsultation = (item) => {
    setSelectedConsultation(item);
    setShowDetailModal(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        if (navigation.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/home');
        }
      }} style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
        <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
      </TouchableOpacity>
      <Text style={styles.title}>Consultations</Text>
      {alert && (
        <View style={[styles.alert, alert.type === 'error' ? styles.alertError : styles.alertSuccess]}>
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.addBtn} onPress={() => setShowNewModal(true)}>
        <MaterialIcons name="add-circle" size={28} color="#2563eb" />
        <Text style={styles.addBtnText}>Ask a Question</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#2563eb" style={{ marginVertical: 16 }} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={list}
        keyExtractor={item => item._id?.toString()}
        renderItem={({ item }) => (
          <ConsultationCard
            item={item}
            onView={handleViewConsultation}
            onDelete={handleDeleteConsultation}
            onContinueChat={handleContinueChat}
          />
        )}
        ListEmptyComponent={(!loading ? <Text style={styles.emptyText}>No consultations found.</Text> : null)}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <Modal visible={showNewModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ask a New Question</Text>
            {loadingDoctors ? (
              <ActivityIndicator size="large" color="#2563eb" />
            ) : errorDoctors ? (
              <Text style={styles.errorText}>{errorDoctors}</Text>
            ) : (
              <>
                <Text style={styles.label}>Select Doctor</Text>
                <ScrollView style={styles.selectList}>
                  {doctors && doctors.length > 0 ? doctors.map(doc => {
                    const name = doc.name || (doc.user ? `${doc.user.firstName || ''} ${doc.user.lastName || ''}`.trim() : '');
                    return (
                      <TouchableOpacity
                        key={doc._id || doc.id}
                        style={[styles.selectItem, selectedDoctor === (doc._id || doc.id) && styles.selectItemSelected]}
                        onPress={() => setSelectedDoctor(doc._id || doc.id)}
                      >
                        <Text style={styles.selectItemText}>{name}</Text>
                      </TouchableOpacity>
                    );
                  }) : <Text style={styles.emptyText}>No doctors available.</Text>}
                </ScrollView>
                <Text style={styles.label}>Your Question</Text>
                <TextInput
                  style={styles.input}
                  value={question}
                  onChangeText={setQuestion}
                  placeholder="Type your question here..."
                  multiline
                  numberOfLines={4}
                />
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowNewModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, (!selectedDoctor || !question.trim()) && { backgroundColor: '#d1d5db' }]}
                onPress={handleAddConsultation}
                disabled={!selectedDoctor || !question.trim()}
              >
                <Text style={styles.modalBtnText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showDetailModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Consultation Details</Text>
            {selectedConsultation && (
              <>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(selectedConsultation.doctorName)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.doctorName}>{selectedConsultation.doctorName}</Text>
                    {!!selectedConsultation.doctorSpecialty && (
                      <Text style={styles.doctorSpecialty}>{selectedConsultation.doctorSpecialty}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.qaBox}>
                  <Text style={styles.qaLabel}>Question:</Text>
                  <Text style={styles.qaText}>{selectedConsultation.question || 'No question provided.'}</Text>
                </View>
                <View style={styles.qaBox}>
                  <Text style={styles.qaLabel}>Answer:</Text>
                  <Text style={styles.qaText}>{selectedConsultation.answer || <Text style={{ fontStyle: 'italic', color: '#facc15' }}>No answer yet.</Text>}</Text>
                </View>
              </>
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowDetailModal(false)}>
                <Text style={styles.modalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showFollowUpModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Follow-Up Question</Text>
            <Text style={styles.label}>Your Question</Text>
            <TextInput
              style={styles.input}
              value={followUpQuestion}
              onChangeText={setFollowUpQuestion}
              placeholder="Type your follow-up question here..."
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setShowFollowUpModal(false)}>
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, !followUpQuestion.trim() && { backgroundColor: '#d1d5db' }]}
                onPress={handleSendFollowUp}
                disabled={!followUpQuestion.trim()}
              >
                <Text style={styles.modalBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  alert: { padding: 10, borderRadius: 8, marginBottom: 10 },
  alertError: { backgroundColor: '#fee2e2' },
  alertSuccess: { backgroundColor: '#dcfce7' },
  alertText: { color: '#1e293b', fontSize: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  addBtnText: { color: '#2563eb', fontWeight: 'bold', fontSize: 16, marginLeft: 6 },
  errorText: { color: '#ef4444', marginBottom: 8 },
  emptyText: { color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginTop: 32 },
  card: { backgroundColor: '#f3f4f6', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0e7ef', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#64748b', fontWeight: 'bold', fontSize: 18 },
  doctorName: { fontWeight: 'bold', fontSize: 16, color: '#1e293b' },
  doctorSpecialty: { color: '#64748b', fontSize: 13 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 12, textTransform: 'capitalize' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  typeText: { marginLeft: 6, color: '#2563eb', fontWeight: 'bold', fontSize: 13 },
  qaBox: { backgroundColor: '#e0e7ef', borderRadius: 10, padding: 8, marginBottom: 6 },
  qaLabel: { fontWeight: 'bold', color: '#1e293b', fontSize: 13 },
  qaText: { color: '#334155', fontSize: 13 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 6 },
  actionBtnText: { marginLeft: 4, fontWeight: 'bold', fontSize: 13, color: '#2563eb' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%', maxWidth: 400 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', color: '#1e293b', marginBottom: 6, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 10, minHeight: 60, textAlignVertical: 'top', marginBottom: 8 },
  selectList: { maxHeight: 120, marginBottom: 8 },
  selectItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  selectItemSelected: { backgroundColor: '#dbeafe' },
  selectItemText: { color: '#1e293b', fontSize: 15 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  modalBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginLeft: 8 },
  modalBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
