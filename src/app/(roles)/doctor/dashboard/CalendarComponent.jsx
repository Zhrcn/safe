'use client';

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';

const CalendarComponent = ({ appointments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startingDayIndex = getDay(startOfMonth(currentMonth));
  const paddingDays = Array.from({ length: startingDayIndex }, (_, i) => i);

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const appointmentsForSelectedDay = appointments.filter(appointment => 
    isSameDay(new Date(appointment.date), selectedDate)
  );

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300 transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-medium text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-gray-700 text-gray-300 transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div className="border-b border-gray-700 mb-4" />

        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
            <div key={index} className="py-1">{dayName}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm flex-grow">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="p-2"></div>
          ))}
          {daysInMonth.map((day) => (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-lg transition-colors duration-200
                ${isSameDay(day, selectedDate) ? 'bg-blue-600 text-white font-bold' : ''}
                ${isSameMonth(day, currentMonth) ? 'hover:bg-gray-700 text-white' : 'text-gray-500 cursor-not-allowed'}
              `}
              disabled={!isSameMonth(day, currentMonth)}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-gray-700 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-3">
          {format(selectedDate, 'MMMM d, yyyy')}'s Appointments ({appointmentsForSelectedDay.length})
        </h3>
        {appointmentsForSelectedDay.length === 0 ? (
          <div className="text-gray-500 text-sm flex flex-col items-center justify-center py-6">
            <CalendarClock size={24} className="mb-3 opacity-50" />
            <p>No appointments for this day.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {appointmentsForSelectedDay.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 bg-gray-700 p-3 rounded-lg border border-gray-600">
                <div className="w-9 h-9 rounded-full bg-blue-700/30 flex items-center justify-center text-blue-300 text-base font-medium">
                  {appointment.patientName[0]}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-white">{appointment.patientName}</p>
                  <p className="text-xs text-gray-400">{appointment.time}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Confirmed' 
                    ? 'bg-green-700/30 text-green-300'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-700/30 text-yellow-300'
                    : 'bg-gray-700/30 text-gray-300'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarComponent; 