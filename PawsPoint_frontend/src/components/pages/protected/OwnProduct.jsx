import React, { useEffect, useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    return () => clearTimeout(timer);
  }, [auth, navigate]);

  // Fetch products
  const getProduct = async () => {
    const userId = auth?.user?._id;
    if (!userId) {
      toast.error('User ID is missing');
      return;
    }

    try {
      const response = await axios.get(
        `${backend_url}/api/v1/products/seller/${userId}`,
        { params: { page } }
      );

      setProducts(response.data.data);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Network Error, Try again');
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getProduct();
    }
  }, [auth, page]);

  // Handle delete
  const handleDelete = async (productId) => {
    try {
      let answer = window.prompt('Are you sure you want to delete this product?');
      if (!answer || answer !== 'yes') return;

      await axios.delete(`${backend_url}/api/v1/products/p/${productId}`);
      toast.success('Product deleted successfully');
      getProduct();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Wrapper>
      <div className="w-full flex justify-center items-center p-3 bg-night">
        <h1 className="text-yellow-300 text-2xl font-semibold">My Products</h1>
      </div>

      <div className="flex flex-row flex-wrap p-3 gap-4 bg-night justify-center">
        {products.length > 0 ? (
          products.map((product, id) => (
            <div className="bg-slate-800 p-2 rounded-lg w-64" key={id}>
              <h1 className="text-white text-md font-medium">
                {product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}
              </h1>
              <ProductCard ur={product.product_Images[0]} />

              <button
                aria-label="Update Product"
                className="w-full px-1 py-2 my-2 text-white font-bold text-lg rounded-full shadow-lg transition-transform transform bg-transparent border-2 border-white hover:scale-105 hover:border-green-600 hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none"
                onClick={() =>
                  navigate('/dashboard/update-product', {
                    state: { productId: product._id },
                  })
                }
              >
                Update
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                className="w-full bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-6 py-2 rounded text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <h2 className="text-white text-center w-full">No products found</h2>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                page === index + 1
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-gray-700 text-white'
              } hover:bg-yellow-500 transition`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export default OwnProduct;
