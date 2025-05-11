import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Wrapper from '../Wrapper/wrapper';
import axios from 'axios';
import { backend_url } from '../../utils/Config';
import { useAuth } from '../../context/AuthContext';

const CategoryPets = () => {
  const { pet_Type } = useParams();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth]=useAuth()

  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPetsByCategory = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/api/v1/pets/search?pet_Type=${pet_Type}`
      );
      setPets(response.data.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetsByCategory();
  }, [pet_Type]);

  const handleOrderSubmit = async () => {
    const userId=auth?.user?._id
    if (!phone || !address) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
     // adjust key if different

      const response = await axios.post(
        `${backend_url}/api/v1/pets/order`,
        { userId:userId,
          petId: selectedPet._id,
          phone,
          address,
        }

      );

      alert(response.data.message || "Order placed!");
      setShowModal(false);
      setPhone('');
      setAddress('');
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Failed to place order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <div className="bg-gray-900 min-h-screen text-white py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-10">
          {pet_Type}s Available for Adoption 🐾
        </h1>

        {loading ? (
          <p className="text-center text-xl">Loading {pet_Type}s...</p>
        ) : pets.length === 0 ? (
          <p className="text-center text-xl">No {pet_Type}s available right now.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div
                key={pet._id}
                className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <img
                  src={pet.pet_Images[0]}
                  alt={pet.breed_Name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-2xl font-bold mb-2">{pet.breed_Name}</h2>
                  <p className="text-sm text-gray-300 mb-3">{pet.pet_Description}</p>
                  <div className="flex justify-between text-gray-400 text-sm mb-4">
                    <span>Age: {pet.pet_Age} yr</span>
                    <span>₹ {pet.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPet(pet);
                      setShowModal(true);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md transition"
                  >
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedPet && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Order for {selectedPet.breed_Name}
              </h2>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
              />
              <textarea
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleOrderSubmit}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded"
                >
                  {submitting ? "Placing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default CategoryPets;
