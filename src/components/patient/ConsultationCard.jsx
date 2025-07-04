import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Badge, Button } from '@/components/ui';
import { getDoctorName, getStatusVariant } from '@/lib/utils';
import { deleteConsultation } from '@/store/slices/patient/consultationsSlice';

const ConsultationCard = ({ consultation, onDelete, onContinueChat }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(t('Are you sure you want to delete this consultation?'))) {
      setIsDeleting(true);
      try {
        await dispatch(deleteConsultation(consultation._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete consultation:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t('Consultation with')} {getDoctorName(consultation.doctor)}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(consultation.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(consultation.status)}>
            {t(consultation.status)}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {t('Initial Question')}:
          </h4>
          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
            {consultation.question}
          </p>
        </div>

        {consultation.answer && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              {t('Doctor Response')}:
            </h4>
            <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
              {consultation.answer}
            </p>
          </div>
        )}

        {consultation.messages && consultation.messages.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {t('Conversation History')}:
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMessages(!showMessages)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showMessages ? t('Hide Messages') : t('Show Messages')}
              </Button>
            </div>
            
            {showMessages && (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {consultation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'patient'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-6">
        {consultation.status === 'Answered' && (
          <Button
            onClick={() => onContinueChat(consultation)}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            {t('Continue Chat')}
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="destructive"
          size="sm"
          disabled={isDeleting}
        >
          {isDeleting ? t('Deleting...') : t('Delete')}
        </Button>
      </div>
    </div>
  );
};

export default ConsultationCard; 