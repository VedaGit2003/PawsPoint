import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../Wrapper/wrapper';
import axios from 'axios';
import { backend_url } from '../../utils/Config';
import ProductWithOption from '../../shared/ProductWithOption';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

// Price ranges
const priceRanges = [
  { label: 'Under $300', min: 0, max: 300 },
  { label: 'Under $500', min: 0, max: 500 },
  { label: 'Under $700', min: 0, max: 700 },
  { label: 'Under $1000', min: 0, max: 1000 },
  { label: 'Under $2000', min: 0, max: 2000 },
];

// Categories
const categories = [
  "Pet Food & Treats",
  "Pet Accessories",
  "Toys",
  "Pet Grooming & Hygiene",
  "Pet Health & Wellness",
  "Pet Housing & Enclosures",
  "Pet Training & Behavior",
  "Pet Adoption & Services"
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [auth]=useAuth()

  const userId=auth?.user?._id

  useEffect(() => {
    getAllProducts();
    getCartCount();
  }, [cartCount]);

  useEffect(() => {
    applyFilters();
  }, [selectedPrice, selectedCategory, products]);

  // Fetch all products
  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/v1/products`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch cart count
  const getCartCount = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/v1/cart/getCarts/${userId}`);
      setCartCount(response.data.cart.items.length);
    } catch (error) {
      console.log("Error fetching cart:", error);
    }
  };

  // Filter products
  const applyFilters = () => {
    let filtered = [...products];

    if (selectedPrice) {
      filtered = filtered.filter(
        product => product.price >= selectedPrice.min && product.price <= selectedPrice.max
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        product => product.category === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <Wrapper current={'shop'}>
      <div className="w-full flex flex-col bg-gray-950 text-neutral-100 min-h-screen">
        {/* Hero Image */}
        <img
          src="https://supertails.com/cdn/shop/files/Big_sale_562b1227-ffb9-48e4-96fb-c5c866b149b9_1600x.png?v=1737615716"
          className="w-full h-52 sm:h-64 object-cover"
          alt="Sale Banner"
        />
  
        {/* Toggle Button for Mobile Filter */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-amber-500 px-4 py-2 rounded-md text-white font-medium hover:bg-amber-600 transition"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
  
        {/* Filters + Products Layout */}
        <div className="flex flex-col md:flex-row w-full">
          {/* Sidebar Filters */}
          <aside
            className={`fixed md:static top-0 left-0 z-40 md:z-auto w-4/5 sm:w-2/3 md:w-1/5 bg-gray-900 p-4 h-full md:h-max rounded-md shadow-xl transform ${
              showFilters ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:translate-x-0`}
          >
            <h2 className="text-amber-400 text-lg font-semibold mb-3">Filter by Category</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <label className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-2 rounded">
                    <span>{category}</span>
                    <input
                      type="radio"
                      name="category"
                      onChange={() => setSelectedCategory(category)}
                      checked={selectedCategory === category}
                      className="accent-amber-500"
                    />
                  </label>
                </li>
              ))}
            </ul>
  
            <h2 className="text-amber-400 text-lg font-semibold mt-6 mb-3">Filter by Price</h2>
            <ul className="space-y-2">
              {priceRanges.map((range, index) => (
                <li key={index}>
                  <label className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-2 rounded">
                    <span>{range.label}</span>
                    <input
                      type="radio"
                      name="price"
                      onChange={() => setSelectedPrice(range)}
                      checked={selectedPrice === range}
                      className="accent-amber-500"
                    />
                  </label>
                </li>
              ))}
            </ul>
          </aside>
  
          {/* Products Section */}
          <main className="flex-1 p-4 pt-0 md:pt-4">
            <h1 className="text-3xl text-amber-400 font-bold text-center mb-6">Happy Cuddle</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, id) => (
                  <div
                    key={id}
                    className="bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
                  >
                    <ProductWithOption
                      pID={product?._id}
                      urls={product?.product_Images[0]}
                      product_name={product?.name}
                      price={product?.price}
                      onAddToCartSuccess={getCartCount}
                    />
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-400">No Product Available</p>
              )}
            </div>
          </main>
        </div>
  
        {/* Floating Cart Button */}
        <div
          className="fixed bottom-5 right-5 bg-amber-500 text-white p-4 rounded-full shadow-xl flex items-center justify-center cursor-pointer hover:bg-amber-600 transition-all"
          onClick={() => navigate('/cart')}
        >
          <FaShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
  
  
};

export default Shop;
