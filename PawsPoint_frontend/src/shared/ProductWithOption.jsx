import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Context for authentication
import axios from "axios";
import { backend_url } from "../utils/Config";
import { toast } from "react-toastify"; 

const ProductWithOption = ({ pID, urls, product_name, price,onAddToCartSuccess }) => {
  const navigate = useNavigate();
  const [auth] = useAuth(); // Get user authentication details
  const [cartItems, setCartItems] = useState([]); // Manage cart items locally


  const handleAddToCart = async () => {
    if (!auth?.user) {
      toast.warn("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(`${backend_url}/api/v1/cart/add`, {
        userId: auth?.user?._id,
        productId: pID,
        quantity: 1,
      });

      if (response.data.success) {
        setCartItems(response.data.cart.items); // Update local cart state
        toast.success("Item added to cart!");

        if (onAddToCartSuccess) {
          onAddToCartSuccess();
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart.");
    }
  };

  return (
    <div className="bg-gray-900 h-64 w-36 md:h-72 md:w-52 p-2 flex flex-col rounded-lg shadow-md hover:shadow-xl transition-all duration-300 mb-3">
      {/* Product image & info wrapped in link */}
      <Link to={`/p/${pID}`} className="flex flex-col items-center">
        <img src={urls} alt="product" className="h-32 w-full object-contain rounded-md mb-2" />
        <h1 className="text-amber-400 font-bold text-sm text-center">
          {product_name.length > 14 ? product_name.substring(0, 14) + "..." : product_name}
        </h1>
        <h2 className="text-green-400 text-lg font-semibold mt-1">Rs. {price}</h2>
      </Link>

      {/* Buy Now Button */}
      <button
        title="Save"
        className="mt-2 w-full flex items-center justify-center bg-lime-600 hover:bg-lime-500 active:bg-lime-700 text-white font-semibold py-1.5 rounded-md transition-all duration-200"
        onClick={() => navigate(`/o/${pID}`)}
      >
        <span className="text-sm">Buy Now</span>
      </button>

      {/* Add to Cart Button */}
      <button
       onClick={handleAddToCart}
        className="mt-2 w-full bg-purple-500 text-white font-semibold py-1.5 rounded-md hover:bg-purple-600 active:bg-purple-700 transition-all duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductWithOption;
