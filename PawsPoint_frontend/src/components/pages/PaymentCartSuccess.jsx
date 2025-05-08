import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { backend_url } from '../../utils/Config';
import axios from 'axios';
import { toast } from 'react-toastify';

const PaymentCartSuccess = () => {
  const query = new URLSearchParams(useLocation().search);
  const reference = query.get("reference");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const placeOrderFromLocalStorage = async () => {
      setIsProcessing(true);
      const storedOrderData = localStorage.getItem("orderData");
      
      if (!storedOrderData) {
        toast.error("No order data found!");
        navigate("/");
        return;
      }

      try {
        const orders = JSON.parse(storedOrderData);

        const validatedOrders = orders.map(order => ({
          user: order.user,
          seller: order.seller,
          productId: order.productId,
          itemType: "Product", // Ensure this matches your backend expectations
          quantity: order.quantity,
          shipping_Address: {
            building_No: order.shipping_Address.building_No,
            street: order.shipping_Address.street,
            landmark: order.shipping_Address.landmark || '',
            city: order.shipping_Address.city,
            state: order.shipping_Address.state,
            country: order.shipping_Address.country,
            pincode: order.shipping_Address.pincode
          },
          billing_Address: {
            building_No: order.billing_Address.building_No,
            street: order.billing_Address.street,
            landmark: order.billing_Address.landmark || '',
            city: order.billing_Address.city,
            state: order.billing_Address.state,
            country: order.billing_Address.country,
            pincode: order.billing_Address.pincode
          },
          price: order.price,
          payment_Method: order.payment_Method,
          payment_Id: reference,
          status: "Confirmed"
        }));

        // Process orders with proper error handling
        const responses = await Promise.allSettled(
          validatedOrders.map(order => 
            axios.post(`${backend_url}/api/v1/orders/singleOrderOnline`, order)
          )
        );
       
        console.log(responses)
        // Analyze results
        const successfulOrders = responses.filter(r => r.status === 'fulfilled');
        const failedOrders = responses.filter(r => r.status === 'rejected');

        // if (failedOrders.length > 0) {
        //   console.error("Failed orders:", failedOrders);
        //   toast.error(`${failedOrders.length} orders failed to process`);
        // }

        if (successfulOrders.length > 0) {
          toast.success(`Successfully placed ${successfulOrders.length} orders!`);
          localStorage.removeItem("orderData");
          setTimeout(() => navigate("/orders"), 3000);
        } else {
          toast.error("All orders failed to process");
          navigate("/cart");
        }

      } catch (err) {
        console.error("Order error:", err);
        toast.error(`Order processing failed: ${err.response?.data?.message || err.message}`);
        navigate("/cart");
      } finally {
        setIsProcessing(false);
        localStorage.removeItem("orderData");
      }
    };

    if (reference) {
      placeOrderFromLocalStorage();
    } else {
      toast.error("Payment reference missing!");
      navigate("/");
    }
  }, [reference, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-green-600 mb-4 text-center">
          {isProcessing ? "Processing Your Order..." : "Payment Successful!"}
        </h1>
        
        {reference && (
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600">Reference ID:</p>
            <p className="font-mono text-gray-800 break-all">{reference}</p>
          </div>
        )}

        <div className="text-center">
          {isProcessing ? (
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          ) : (
            <button
              onClick={() => navigate("/orders")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Orders
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCartSuccess;