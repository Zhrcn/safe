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
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, CalendarClock } from 'lucide-react';
import { useTheme } from '@/components/ThemeProviderWrapper';
import Button from '@/components/ui/Button'

const getComputedCssVariable = (variableName) => {
  if (typeof window !== 'undefined') {
    let value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    if (value.includes('%')) {
      value = value.replace(/\s+/g, ', ');
    }
    return value;
  }
  return ''; 
};

const CalendarComponent = ({ appointments }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { mode } = useTheme();

  const [calendarColors, setCalendarColors] = useState({
    primary: '',
    primaryForeground: '',
    border: '',
    mutedForeground: '',
  });

  useEffect(() => {
    const primaryColorComponents = getComputedCssVariable('--primary');
    const primaryForegroundComponents = getComputedCssVariable('--primary-foreground');
    const borderColor = getComputedCssVariable('--border');
    const mutedForeground = getComputedCssVariable('--muted-foreground');

    setCalendarColors({
      primary: `hsl(${primaryColorComponents})`,
      primaryForeground: `hsl(${primaryForegroundComponents})`,
      border: `hsl(${borderColor})`,
      mutedForeground: `hsl(${mutedForeground})`,
    });
  }, [mode]);

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
    <div className="bg-card rounded-2xl shadow-lg border border-border flex flex-col h-full">
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-card-foreground">Calendar</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrevMonth}
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors duration-200"
            >
              <ChevronLeft size={20} />
            </Button>
            <h3 className="text-lg font-medium text-card-foreground">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <Button
              onClick={handleNextMonth}
              className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors duration-200"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
        <div className="border-b border-border mb-4" />
        <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
            <div key={index} className="py-1">{dayName}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm flex-grow">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="p-2"></div>
          ))}
          {daysInMonth.map((day) => (
            <Button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-2xl transition-colors duration-200
                ${isSameMonth(day, currentMonth) ? 'hover:bg-accent hover:text-accent-foreground text-card-foreground' : 'text-muted-foreground cursor-not-allowed'}
              `}
              style={{
                backgroundColor: isSameDay(day, selectedDate) ? calendarColors.primary : '',
                color: isSameDay(day, selectedDate) ? calendarColors.primaryForeground : '',
                borderColor: isToday(day) ? calendarColors.primary : '',
                borderWidth: isToday(day) ? '2px' : '0',
              }}
              disabled={!isSameMonth(day, currentMonth)}
            >
              {format(day, 'd')}
            </Button>
          ))}
        </div>
      </div>
      <div className="p-6 border-t border-border flex flex-col">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">
          {isToday(selectedDate) ? "Today's Appointments" : `${format(selectedDate, 'MMMM d, yyyy')}'s Appointments`} ({appointmentsForSelectedDay.length})
        </h3>
        {appointmentsForSelectedDay.length === 0 ? (
          <div className="text-muted-foreground text-sm flex flex-col items-center justify-center py-6">
            <CalendarClock size={24} className="mb-3 opacity-50" />
            <p>No appointments for this day.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {appointmentsForSelectedDay.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 bg-secondary p-3 rounded-2xl border border-border">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-base font-medium">
                  {appointment.patientName[0]}
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-card-foreground">{appointment.patientName}</p>
                  <p className="text-xs text-muted-foreground">{appointment.time}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'Confirmed' 
                    ? 'bg-green-500/20 text-green-500'
                    : appointment.status === 'Pending'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-muted/20 text-muted-foreground'
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