import axiosInstance from '../axiosInstance';

export const getReminders = async () => {
  const res = await axiosInstance.get('/reminders');
  return res.data.data;
};

export const createReminder = async (reminderData) => {
  const res = await axiosInstance.post('/reminders', reminderData);
  return res.data.data;
};

export const updateReminder = async (id, reminderData) => {
  const res = await axiosInstance.put(`/reminders/${id}`, reminderData);
  return res.data.data;
};

export const deleteReminder = async (id) => {
  const res = await axiosInstance.delete(`/reminders/${id}`);
  return res.data.data;
}; 