import React, { useEffect, useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../shared/Loading';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';

const OnlineAppointmentVet = () => {
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [appointment, setAppointment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user && auth?.user?.user_Role === 'vet') {
        setIsLoading(false);
        toast.success('Authentication Successful');
      } else {
        navigate('/dashboard');
        toast.error('Authentication Failed');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [auth, navigate]);

  const getAppointment = async () => {
    const userId = auth?.user?._id;
    if (!userId) {
      toast.error('User ID is missing');
      return;
    }

    try {
      const response = await axios.get(`${backend_url}/api/v1/appointments/get-all-appointment-vet`);
      setAppointment(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Network Error, Try again');
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getAppointment();
    }
  }, [auth]);

  if (isLoading) {
    return <Loading />;
  }

  const canStartVideoCall = (dateString, timeString) => {
    if (!dateString || !timeString) return false;
  
    const scheduled = new Date(dateString);
  
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return false;
  
    scheduled.setHours(hours);
    scheduled.setMinutes(minutes);
    scheduled.setSeconds(0);
    scheduled.setMilliseconds(0);
  
    const now = new Date();
  
    return now >= scheduled;
  };
  

  return (
    <Wrapper>
      <div className="p-4 bg-blue-300 min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Your Online Appointments</h2>
        {appointment.length === 0 ? (
          <p className="text-gray-600">No appointments found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {appointment.map((a, idx) => (
              <div
                key={a._id}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <h3 className="text-lg font-semibold mb-2">Appointment #{idx + 1}</h3>
                <p><strong>Customer ID:</strong> {a.customer_info?.user_Name || 'N/A'}</p>
                <p><strong>Request From Customer:</strong> {a.request_from_customer ? 'Yes' : 'No'}</p>
                <p><strong>Scheduled Date:</strong> {a.scheduled_date ? new Date(a.scheduled_date).toLocaleDateString() : "Not Scheduled"}</p>
                <p><strong>Scheduled Time:</strong> {a.scheduled_time || "Not Scheduled"}</p>
                <p><strong>Created At:</strong> {new Date(a.created_At).toLocaleString()}</p>
                <p><strong>Updated At:</strong> {new Date(a.updated_At).toLocaleString()}</p>
                
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => navigate(`/vet-appointment-online-update/${a._id}`)}
                    className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
                  >
                    Take Action
                  </button>

                  {canStartVideoCall(a.scheduled_date, a.scheduled_time) && (
  <>
    <button
      onClick={() =>
        window.open(
          `https://superlative-smakager-5aa57c.netlify.app/`,
          '_blank'
        )
      }
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Video Call
    </button>

    <button
      onClick={() => {
        navigator.clipboard.writeText(a._id);
        toast.success('Appointment ID copied to clipboard!');
      }}
      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
    >
      Copy ID({a._id})
    </button>
  </>
)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default OnlineAppointmentVet;

