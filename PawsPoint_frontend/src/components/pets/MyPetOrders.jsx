import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Wrapper from '../Wrapper/wrapper';
import { backend_url } from '../../utils/Config';

const MyPetOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/v1/pets/getUserOrders`);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Wrapper>
      <div className="bg-gray-900 min-h-screen text-white py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10">My Pet Orders 🐾</h1>

        {loading ? (
          <p className="text-center text-xl">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-xl">You have no pet orders.</p>
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
                  <p className="text-sm text-gray-300 mb-2">{order.pet?.pet_Description}</p>
                  <p className="text-sm text-gray-400">Price: ₹{order.pet?.price}</p>
                  <p className="text-sm text-gray-400">Age: {order.pet?.pet_Age} yr</p>
                  <hr className="my-3 border-gray-700" />
                  <p className="text-sm">📍 <strong>Address:</strong> {order.address}</p>
                  <p className="text-sm">📞 <strong>Phone:</strong> {order.phone}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Ordered on: {new Date(order.createdAt).toLocaleDateString()}
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

export default MyPetOrders;
