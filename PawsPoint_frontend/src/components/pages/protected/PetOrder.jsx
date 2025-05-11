import React, { useEffect, useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';

const PetOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {

      const res = await axios.get(`${backend_url}/api/v1/pets/getAllPetOrders`);

      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching all orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <Wrapper>
      <div className="bg-gray-900 min-h-screen text-white py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10">All Pet Orders (Admin View) 🐾</h1>

        {loading ? (
          <p className="text-center text-xl">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-xl">No orders found.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <img
                  src={order.pet?.pet_Images[0]}
                  alt={order.pet?.breed_Name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-1">
                    {order.pet?.breed_Name} ({order.pet?.pet_Type})
                  </h2>
                  <p className="text-sm text-gray-300">{order.pet?.pet_Description}</p>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>💰 Price: ₹{order.pet?.price}</p>
                    <p>🕒 Age: {order.pet?.pet_Age} yr</p>
                    <p>📞 Phone: {order.phone}</p>
                    <p>📍 Address: {order.address}</p>
                    <p>🧑‍🤝‍🧑 Buyer: {order.user?.user_Name} ({order.user?.email})</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    📅 Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default PetOrder;
