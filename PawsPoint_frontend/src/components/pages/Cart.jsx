// components/Cart.js
import React, { useEffect, useState } from "react";
import Wrapper from "../Wrapper/wrapper";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { backend_url } from "../../utils/Config";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useState(null);
  const userId = auth?.user?._id;
  const navigate=useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/v1/cart/getCarts/${userId}`);
        setCart(response.data.cart);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [userId]);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${backend_url}/api/v1/cart/removeCart`, {
        data: { userId, productId },
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.product._id !== productId),
      }));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await axios.put(`${backend_url}/api/v1/cart/update`, { userId, productId, quantity });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.map((item) => item.product._id === productId ? { ...item, quantity } : item),
      }));
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const totalAmount = cart?.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0) || 0;

  return (
    <Wrapper>
      <div className="p-4 bg-gradient-to-b from-slate-50 via-green-300 to-emerald-900 ">
        <h1 className="text-2xl font-bold text-center text-gray-800">Your Cart</h1>
        {cart ? (
          cart.items.length > 0 ? (
            <>
              <div className="mt-4 space-y-4">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                    <img src={item.product.product_Images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)} className="px-2 py-1 bg-gray-300 rounded">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)} className="px-2 py-1 bg-gray-300 rounded">+</button>
                      </div>
                      <p className="text-gray-700 font-bold">₹{item.product.price}</p>
                    </div>
                    <button onClick={() => handleRemove(item.product._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
                  </div>
                ))}
              </div>
              <div className="text-right text-xl font-bold mt-6">Total: ₹{totalAmount}</div>
              {/* order button  */}
             
              <button
  class="relative w-full inline-flex h-12 active:scale-95 transistion overflow-hidden rounded-lg p-[1px] focus:outline-none"
  onClick={() =>
    navigate('/cartOrder', {
      state: {
        productIds: cart.items.map((item) => item.product._id),
      },
    })
  }
>
  <span
    class="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e7029a_0%,#f472b6_50%,#bd5fff_100%)]"
  >
  </span>
  <span
    class="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 undefined"
  >
    Order Now
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 448 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M429.6 92.1c4.9-11.9 2.1-25.6-7-34.7s-22.8-11.9-34.7-7l-352 144c-14.2 5.8-22.2 20.8-19.3 35.8s16.1 25.8 31.4 25.8H224V432c0 15.3 10.8 28.4 25.8 31.4s30-5.1 35.8-19.3l144-352z"
      ></path>
    </svg>
  </span>
</button>

            </>
          ) : <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
        ) : <p className="text-center text-gray-500 mt-6">Loading cart...</p>}
      </div>
    </Wrapper>
  );
};

export default Cart;