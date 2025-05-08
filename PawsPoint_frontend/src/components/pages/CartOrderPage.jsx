import React, { useEffect, useState } from 'react';
import Wrapper from '../Wrapper/wrapper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backend_url } from '../../utils/Config';
import { useAuth } from '../../context/AuthContext';
import Review from '../../images/review.png';

const CartOrderPage = () => {
  const [auth] = useAuth();
  const userId = auth?.user?._id;
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [discount] = useState(10);

  // Billing info
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [billing_address, setbilling_address] = useState('');
  const [billing_city, setbilling_city] = useState('');
  const [billing_pincode, setbilling_pincode] = useState('');
  const [billing_state, setbilling_state] = useState('');
  const [billing_country, setbilling_country] = useState('India');
  const [billing_email, setbilling_email] = useState(auth?.user?.email || '');
  const [billing_phone, setbilling_phone] = useState('');
  const [shipping_is_billing] = useState('YES');

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/v1/cart/getCarts/${userId}`);
        console.log(response.data);
        setCart(response.data.cart);
  
        // Correctly access the items array and product field
        const formattedProducts = response.data.cart.items.map((item) => ({
          ...item.product, // Use item.product instead of item.productId
          quantity: item.quantity,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
  
    if (userId) fetchCart();
  }, [userId]);

  const getDiscountedPrice = (price, quantity) => {
    const discounted = price - (price * discount) / 100;
    return discounted * quantity;
  };

  const totalPrice = products.reduce((acc, product) => {
    return acc + getDiscountedPrice(product.price, product.quantity);
  }, 0);

  const handleOrder = () => {
    if (
      !house ||
      !street ||
      !billing_address ||
      !billing_city ||
      !billing_pincode ||
      !billing_state ||
      !billing_country ||
      !billing_phone
    ) {
      alert("Please fill in all required fields before proceeding!");
      return;
    }

    if (billing_phone.length < 10) {
      alert("Enter a valid phone number");
      return;
    }

    navigate('/pay-multiple', {
      state: {
        products,
        house,
        street,
        landmark,
        billing_address,
        billing_city,
        billing_pincode,
        billing_state,
        billing_country,
        billing_email,
        billing_phone,
        shipping_is_billing,
        total_price: totalPrice,
        discount,
      },
    });
  };

  return (
    <Wrapper>
      <div className="mx-auto w-full px-4 pb-8 bg-night">
        <div className="w-full flex justify-center">
          <img src={Review} className="w-full md:w-1/2 h-40 object-cover rounded-lg" alt="Order Review" />
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-6 mt-4">
          {products.map((product) => (
            <div key={product._id} className="flex gap-4 p-4 bg-slate-800 rounded-lg shadow-md">
              <img src={product.product_Images?.[0]} alt={product.name} className="w-28 h-28 object-contain rounded" />
              <div className="flex flex-col justify-between">
                <h2 className="text-amber-400 font-bold text-xl">{product.name}</h2>
                <span className="text-blue-300">Brand: {product.brand}</span>
                <span className="text-white">Quantity: {product.quantity}</span>
                <span className="text-white">Price: ₹{product.price} × {product.quantity}</span>
                <span className="text-green-400">
                  Discounted: ₹{getDiscountedPrice(product.price, product.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="w-full mt-6 p-4 bg-slate-900 rounded text-white">
          <h3 className="text-xl font-bold mb-2">Price Summary</h3>
          {products.map((product) => (
            <div className="flex justify-between" key={product._id}>
              <span>{product.name} × {product.quantity}</span>
              <span>
                ₹{product.price * product.quantity} - ₹{((product.price * discount) / 100 * product.quantity).toFixed(2)} ={' '}
                <strong>₹{getDiscountedPrice(product.price, product.quantity).toFixed(2)}</strong>
              </span>
            </div>
          ))}
          <hr className="my-2 border-gray-500" />
          <div className="text-right text-green-400 text-xl font-bold">
            Total: ₹{totalPrice.toFixed(2)}
          </div>
        </div>

        {/* Billing Info Form */}
        <div className="mt-6 text-white space-y-4">
          <h2 className="text-2xl font-bold">Billing Information</h2>
          <input value={house} onChange={(e) => setHouse(e.target.value)} className="w-full text-black p-2" placeholder="House/Flat No" />
          <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full text-black p-2" placeholder="Street Name" />
          <input value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full text-black p-2" placeholder="Landmark (optional)" />
          <input value={billing_address} onChange={(e) => setbilling_address(e.target.value)} className="w-full text-black p-2" placeholder="Full Address" />
          <input value={billing_city} onChange={(e) => setbilling_city(e.target.value)} className="w-full text-black p-2" placeholder="City" />
          <input value={billing_state} onChange={(e) => setbilling_state(e.target.value)} className="w-full text-black p-2" placeholder="State" />
          <input value={billing_pincode} onChange={(e) => setbilling_pincode(e.target.value)} className="w-full text-black p-2" placeholder="Pincode" />
          <input value={billing_phone} onChange={(e) => setbilling_phone(e.target.value)} className="w-full text-black p-2" placeholder="Phone Number" />
        </div>

        {auth?.user ? (
          <button
            className="mt-6 w-full bg-amber-500 hover:bg-amber-400 transition text-black font-bold py-3 rounded-lg"
            onClick={handleOrder}
          >
            Proceed to Payment
          </button>
        ) : (
          <div className="text-red-500 mt-6 text-center font-bold">
            Please log in to continue with your order.
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default CartOrderPage;
