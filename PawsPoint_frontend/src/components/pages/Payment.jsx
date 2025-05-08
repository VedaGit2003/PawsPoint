import React, { useEffect, useState } from 'react';
import Wrapper from '../Wrapper/wrapper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { backend_url } from '../../utils/Config';
import { useAuth } from '../../context/AuthContext';
import PaymentImage from '../../images/payment.png';
import axios from 'axios';
import { toast } from 'react-toastify';

const Payment = () => {
  const { pID } = useParams();
  const [product, setProduct] = useState(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState(20);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [auth] = useAuth();
  const navigate = useNavigate();

  const total_price = product?.price - ((product?.price * discount) / 100);

  // console.log(auth.user)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${backend_url}/api/v1/products/p/${pID}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [pID]);

  const handlePlaceOrder = async () => {
    if (!state || !auth?.user || !product) {
      alert("Missing required information. Please check your details.");
      return;
    }
  
    const orderData = {
      user: auth.user._id,
       seller: product.seller_Info,
      productId: product._id, 
      itemType: "Product",
      quantity: 1,
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
      price: total_price,
      delivery_Cost: 0,
      payment_Method: selectedPayment,
    };
  
    try {
      const response = await axios.post(`${backend_url}/api/v1/orders/singleOrder`, orderData, {
        headers: { "Content-Type": "application/json" },
      });
      // console.log(total_price)
      console.log(response.data);
  
      // alert("Order placed successfully!");
    if (response && response?.data?.statusCode===201){
      toast.success("🐕‍🦺 Wou wou...Order Placed ✅")
      navigate("/order-success");
    }
    else{
      toast.error("Some error occured 😥")
    }

    } catch (err) {
      console.error("Order error:", err.response?.data?.message || err.message);
      alert(`Error: ${err.response?.data?.message || "Order creation failed"}`);
    }
  };
  
  const handlePayment=async()=>{
    const orderData = {
      user: auth.user._id,
      seller: product.seller_Info,
      productId: product._id, 
      itemType: "Product",
      quantity: 1,
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
      price: total_price,
      delivery_Cost: 0,
      payment_Method: "Online",
    };

      // Save orderData to localStorage
  localStorage.setItem("orderData", JSON.stringify(orderData));
    try{
      
    const  data={
        total_amount:total_price
      }
    const key_data=await axios.get(`${backend_url}/api/v1/payments/getkey`)
     const response=await axios.post(`${backend_url}/api/v1/payments/process`,data)
     
   const order=response.data.order
    console.log(order)
    // console.log(key_data.data.key)

        //razorpay payment gateway
          // Open Razorpay Checkout
          const options = {
            key: key_data.data.key, // Replace with your Razorpay key_id
            amount: total_price, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: 'INR',
            name: 'PawsPoint',
            description: 'Test Transaction',
            order_id: order.id, // This is the order_id created in the backend
            callback_url: `${backend_url}/api/v1/payments/payment-verification`, // Your success URL
            prefill: {
              name: auth?.user?.user_Name,
              email: auth?.user?.email,
              contact: state.billing_phone
            },
            theme: {
              color: '#F37254'
            },
          };
    
          const rzp = new Razorpay(options);
          rzp.open();

          //razorpay end


    }catch(error){
      console.log(error)

    }
  }

  if (loading) return <Wrapper><div className="text-center py-8">Loading...</div></Wrapper>;
  if (error) return <Wrapper><div className="text-center py-8 text-red-500">{error}</div></Wrapper>;

  return (
    <Wrapper current={"Payment Page"}>
      <div className='w-full bg-night flex flex-col p-2'>
        <div className='w-full flex flex-row justify-center'>
          <img src={PaymentImage} className='w-full md:w-1/2 h-40 object-cover rounded-lg' />
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
                <p className="text-lg font-bold">₹{product?.price}</p>
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer ${selectedPayment === 'online' ? 'border-amber-500 bg-amber-300' : 'border-gray-400'}`}
              onClick={() => setSelectedPayment('online')}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Pay Online</p>
                <div className="text-right">
                  <p className="text-lg font-bold">₹{product?.price}</p>
                  <p className="text-green-600 text-sm">Save ₹{((product?.price) * discount) / 100}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Extra discount with bank offers</p>
            </div>
          </div>
         
      {/* Price Details */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">Price Details (1 Items)</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Product Price</span>
            <span>+ ₹{product?.price}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Discounts</span>
            <span className="text-green-600">- {((product?.price)*discount)/100}</span>
          </div>
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between font-bold">
          <span>Order Total</span>
          <span>₹{total_price}</span>
        </div>
      </div>

      {/* Discount Message */}
      <p className="text-green-600 mb-6">Yay! Your total discount is {((product?.price)*discount)/100}</p>

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            onClick={selectedPayment === 'online' ? handlePayment : handlePlaceOrder}
          >
            {selectedPayment === 'online' ? "Pay Now" : "Place Order"}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Payment;
