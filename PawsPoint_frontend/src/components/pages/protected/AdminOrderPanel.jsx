import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Wrapper from '../../Wrapper/wrapper';

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Rejected", "Delivered"];

const AdminOrderPanel = () => {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user && auth?.user?.user_Role === 'admin') {
        setIsLoading(false);
        fetchOrders()
        toast.success('Authentication Successful');
        
      } else {
        navigate('/dashboard');
        toast.error('Authentication Failed');
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [auth, navigate]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/v1/orders/a/getAllOrders`);
      setOrders(data.orders);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch orders');
    }
  };

  const handleUpdate = async (order) => {
    try {
      const { _id, status, shipment_Time, approx_Delivery_Time, max_Delivery_Time, payment_Id } = order;
      const res = await axios.put(`${backend_url}/api/v1/orders/admin/updateOrder`, {
        orderId: _id,
        status,
        shipment_Time,
        approx_Delivery_Time,
        max_Delivery_Time,
        payment_Id
      });
      toast.success('Order updated');
      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error(error);
      toast.error('Error updating order');
    }
  };

  const handleFieldChange = (id, field, value) => {
    setOrders(prev =>
      prev.map(order =>
        order._id === id ? { ...order, [field]: value } : order
      )
    );
  };

  if (isLoading) return <div className="text-center text-white p-4">Loading Orders...</div>;

  return (
    <Wrapper>
      <div className="p-6 min-h-screen bg-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-yellow-400 border-b-2 border-yellow-400 pb-2">
          🚚 Order Management Dashboard
        </h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">📭 No orders available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="p-6 border border-gray-700 rounded-xl bg-gray-800 shadow-xl transition-all hover:shadow-2xl"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-xl font-bold text-green-400 mb-2 md:mb-0">
                    📦 Order #{order._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Delivered' ? 'bg-green-800 text-green-300' :
                    order.status === 'Cancelled' ? 'bg-red-800 text-red-300' :
                    'bg-blue-800 text-blue-300'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-6 bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-400 mb-2">🏡 Billing Address</h3>
                  <p className="text-gray-300">
                    {order.billing_Address.building_No}, {order.billing_Address.street}<br/>
                    {order.billing_Address.city}, {order.billing_Address.state}<br/>
                    {order.billing_Address.pincode}, {order.billing_Address.country}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {order.cart.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      {item.item?.product_Images?.[0] && (
                        <img 
                          src={item.item.product_Images[0]} 
                          alt={item.item.name} 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-500"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-200">{item.item?.name || 'Product'}</p>
                        <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                        <p className="text-yellow-400 text-sm mt-1">
                          ₹{item.item?.price ? (item.item.price * item.quantity).toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Order Status</label>
                    <select
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      value={order.status}
                      onChange={(e) => handleFieldChange(order._id, "status", e.target.value)}
                    >
                      {statusOptions.map((option) => (
                        <option 
                          key={option} 
                          value={option}
                          className="bg-gray-800"
                        >
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {['shipment_Time', 'approx_Delivery_Time', 'max_Delivery_Time'].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        {field.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        value={order[field] ? new Date(order[field]).toISOString().slice(0, 16) : ''}
                        onChange={(e) => handleFieldChange(order._id, field, e.target.value)}
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Payment ID</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      value={order.payment_Id || ''}
                      onChange={(e) => handleFieldChange(order._id, "payment_Id", e.target.value)}
                      placeholder="Enter payment ID..."
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleUpdate(order)}
                  className="w-full md:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293a1 1 0 00-1.414 0z" />
                  </svg>
                  Update Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AdminOrderPanel;

