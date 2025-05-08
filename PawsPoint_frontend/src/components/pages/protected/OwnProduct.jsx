import React, { useEffect, useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import { useAuth } from '../../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../shared/Loading';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';
import ProductCard from '../../../shared/ProductCard';

const OwnProduct = () => {
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Authentication check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user && auth?.user?.user_Role === 'seller') {
        setIsLoading(false);
        toast.success('Authentication Successful');
      } else {
        navigate('/dashboard');
        toast.error('Authentication Failed');
      }
    }, 3000);

    return () => clearTimeout(timer); // Use clearTimeout instead of clearInterval
  }, [auth, navigate]);

  // Fetch products
  const getProduct = async () => {
    const userId = auth?.user?._id; // Get user ID
    if (!userId) {
      toast.error('User ID is missing');
      return;
    }

    try {
      const response = await axios.get(`${backend_url}/api/v1/products/seller/${userId}`);
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Network Error, Try again');
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getProduct(); // Fetch products if user is authenticated
    }
  }, [auth]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      let answer = window.prompt('Are you sure you want to delete this product?');
      if (!answer || answer !== 'yes') return;

      const { data } = await axios.delete(`${backend_url}/api/v1/products/p/${productId}`);
      toast.success('Product deleted successfully');

      // Re-fetch the products after deletion to re-render the component
      getProduct();

    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  // Show loading spinner if still loading
  if (isLoading) {
    return <Loading />;
  }

  // Render products
  return (
    <Wrapper>
      <div className="w-full flex justify-center items-center p-3 bg-night">
        <h1 className="text-yellow-300">My Products</h1>
      </div>
      <div className="flex flex-row flex-wrap p-3 gap-4 bg-night">
        {products.length > 0 ? (
          products.map((product, id) => (
            <div className="bg-slate-800 p-2" key={id}>
              <h1 className="text-white">{product.name.slice(0,15)+"..."}</h1>
              <ProductCard ur={product.product_Images[0]} />

              <button
                aria-label="Update Product"
                className="w-full px-1 py-2 my-2 text-white font-bold text-lg rounded-full shadow-lg transition-transform transform bg-transparent border-2 border-white hover:scale-105 hover:border-green-600 hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none"
                id="updateButton"
                onClick={() => navigate('/dashboard/update-product', { state: { productId: product._id } })} // Navigate with product ID
              >
                Update
              </button>

              <button 
                onClick={() => handleDelete(product._id)}
                className="w-full cursor-pointer bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-6 py-2 rounded text-white font-semibold shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">
                Delete
              </button>
            </div>
          ))
        ) : (
          <h2>No products found</h2>
        )}
      </div>
    </Wrapper>
  );
};

export default OwnProduct;

