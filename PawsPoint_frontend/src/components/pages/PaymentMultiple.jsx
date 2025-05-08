import React, { useEffect, useState } from 'react';
import Wrapper from '../Wrapper/wrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../utils/Config';
import { useAuth } from '../../context/AuthContext';
import PaymentImage from '../../images/payment.png';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentMultiple = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [discount] = useState(10);
  const [products, setProducts] = useState(state?.products || []);

  // Fixed total calculation with quantity
  const total_price = products.reduce(
    (acc, product) => acc + ((product.price - (product.price * discount) / 100) * product.quantity),
    0
  );

  // Fixed savings calculation with quantity
  const totalSavings = products.reduce(
    (acc, p) => acc + ((p.price * discount) / 100) * p.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!state || !auth?.user || !products.length) {
      alert("Missing required information. Please check your details.");
      return;
    }

    try {
      for (const product of products) {
        const orderData = {
          user: auth.user._id,
          seller: product.seller_Info,
          productId: product._id,
          itemType: "Product",
          quantity: product.quantity, // Fixed quantity usage
          shipping_Address: {
            building_No: state.house,
            street: state.street,
            landmark: state.landmark,
            city: state.billing_city,
            state: state.billing_state,
            country: state.billing_country,
            pincode: state.billing_pincode,
          },
          billing_Address: {
            building_No: state.house,
            street: state.street,
            landmark: state.landmark,
            city: state.billing_city,
            state: state.billing_state,
            country: state.billing_country,
            pincode: state.billing_pincode,
          },
          price: (product.price - (product.price * discount) / 100) * product.quantity, // Fixed price calculation
          delivery_Cost: 0,
          payment_Method: selectedPayment,
        };

        await axios.post(`${backend_url}/api/v1/orders/singleOrder`, orderData, {
          headers: { "Content-Type": "application/json" },
        });
      }

      toast.success("🎉 All orders placed successfully!");
      navigate("/order-success");
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Something went wrong while placing orders.");
    }
  };

  const handleOnlinePayment = async () => {
    if (!state || !auth?.user || !products.length) {
      alert("Missing required information. Please check your details.");
      return;
    }
  
    // Create array to store all order data
    const allOrders = [];
  
    // Generate order data for all products
    for (const product of products) {
      const orderData = {
        user: auth.user._id,
        seller: product.seller_Info,
        productId: product._id,
        itemType: "Product",
        quantity: product.quantity,
        shipping_Address: {
          building_No: state.house,
          street: state.street,
          landmark: state.landmark || '',
          city: state.billing_city,
          state: state.billing_state,
          country: state.billing_country,
          pincode: state.billing_pincode
        },
        billing_Address: {
          building_No: state.house,
          street: state.street,
          landmark: state.landmark || '',
          city: state.billing_city,
          state: state.billing_state,
          country: state.billing_country,
          pincode: state.billing_pincode
        },
        price: (product.price - (product.price * discount) / 100) * product.quantity,
        delivery_Cost: 0,
        payment_Method: selectedPayment,
      };
      allOrders.push(orderData);
    }
  
    // Store all orders in localStorage
    localStorage.setItem("orderData", JSON.stringify(allOrders));
  
    try {
      const data = { total_amount: Math.round(total_price) };
      const key_data = await axios.get(`${backend_url}/api/v1/payments/getkey`);
      const response = await axios.post(
        `${backend_url}/api/v1/payments/process`,
        data
      );
  
      const order = response.data.order;
  
      const options = {
        key: key_data.data.key,
        amount: total_price * 100, // Convert to paise
        currency: 'INR',
        name: 'PawsPoint',
        description: 'Multiple Products Order',
        order_id: order.id,
        callback_url: `${backend_url}/api/v1/payments/payment-verification-cart`,
        prefill: {
          name: auth?.user?.user_Name,
          email: auth?.user?.email,
          contact: state.billing_phone,
        },
        theme: { color: '#F37254' },
      };
  
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Online payment initiation failed.");
    }
  };

  return (
    <Wrapper>
      <div className='w-full bg-night flex flex-col p-2'>
        <div className='w-full flex justify-center'>
          <img src={PaymentImage} className='w-full md:w-1/2 h-40 object-cover rounded-lg' alt='Payment Options'/>
        </div>

        <div className="w-full md:w-1/2 mx-auto bg-green-200 p-4 font-sans rounded-md">
          <h1 className="text-2xl font-bold mb-6">Select Payment Method</h1>

          <div className="space-y-4 mb-8">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPayment === 'COD' ? 'border-amber-500 bg-amber-300' : 'border-gray-400'}`}
              onClick={() => setSelectedPayment('COD')}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">Cash on Delivery</p>
                <p className="text-lg font-bold">₹{total_price.toFixed(2)}</p>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPayment === 'Online' ? 'border-amber-500 bg-amber-300' : 'border-gray-400'}`}
              onClick={() => setSelectedPayment('Online')}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Pay Online</p>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{total_price.toFixed(2)}</p>
                  <p className="text-green-600 text-sm">Save ₹{totalSavings.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Extra discount with bank offers</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">Price Details ({products.length} Items)</h2>
            {products.map((p, i) => {
              const itemPrice = (p.price - (p.price * discount) / 100) * p.quantity;
              return (
                <div className="flex justify-between text-sm" key={i}>
                  <span>{p.name} × {p.quantity}</span>
                  <span>₹{itemPrice.toFixed(2)}</span>
                </div>
              );
            })}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>Order Total</span>
              <span>₹{total_price.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-green-600 mb-6">Yay! You saved ₹{totalSavings.toFixed(2)} on this order!</p>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={selectedPayment === 'Online' ? handleOnlinePayment : handlePlaceOrder}
          >
            {selectedPayment === 'Online' ? "Pay Now" : "Place Order"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default PaymentMultiple;