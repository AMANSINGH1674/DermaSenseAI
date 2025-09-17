import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar as CalendarIcon, Clock, Check } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [calendarType, setCalendarType] = useState<'google' | 'apple' | null>(null);

  const times = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleAddToCalendar = () => {
    if (!selectedDate || !selectedTime) return;

    const eventTitle = 'Medical Appointment - MedChainAI';
    const eventDescription = 'Your medical appointment scheduled through MedChainAI';
    const startTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`;
    const endTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime.split(':')[0]}:${String(parseInt(selectedTime.split(':')[1]) + 30).padStart(2, '0')}:00`;

    if (calendarType === 'google') {
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDescription)}&dates=${startTime.replace(/[-:]/g, '')}/${endTime.replace(/[-:]/g, '')}`;
      window.open(googleUrl, '_blank');
    } else if (calendarType === 'apple') {
      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startTime.replace(/[-:]/g, '')}
DTEND:${endTime.replace(/[-:]/g, '')}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
END:VEVENT
END:VCALENDAR`;
      
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'appointment.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Schedule Appointment</h3>
          <button onClick={onClose} className="text-secondary-500 hover:text-secondary-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {!calendarType ? (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold mb-4">Choose Calendar Type</h4>
              <button
                onClick={() => setCalendarType('google')}
                className="w-full p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center justify-center space-x-2"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_48dp.png" alt="Google Calendar" className="w-6 h-6" />
                <span>Add to Google Calendar</span>
              </button>
              <button
                onClick={() => setCalendarType('apple')}
                className="w-full p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 flex items-center justify-center space-x-2"
              >
                <CalendarIcon className="text-secondary-700" size={24} />
                <span>Add to Apple Calendar</span>
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {times.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-sm ${
                          selectedTime === time
                            ? 'bg-primary-500 text-white'
                            : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="pt-4">
                  <button
                    onClick={handleAddToCalendar}
                    className="w-full btn-primary py-2 flex items-center justify-center"
                  >
                    <Check size={18} className="mr-2" />
                    Add to Calendar
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;