import React, { useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';

const AppointmentAcceptByVet = () => {
  const { appointmentId } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();

  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error('Please fill in both date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `${backend_url}/api/v1/appointments/update-appointment/${appointmentId}`,
        {
          accept_by_vet: true,
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
        },
      );
      toast.success('Appointment accepted and scheduled');
      navigate('/vet-appointment-online');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <div className="max-w-xl mx-auto p-4 bg-white rounded shadow mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Accept & Schedule Appointment</h2>

        <div className="mb-4">
          <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            id="scheduled_date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Time
          </label>
          <input
            type="time"
            id="scheduled_time"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Appointment'}
        </button>
      </div>
    </Wrapper>
  );
};

export default AppointmentAcceptByVet;
