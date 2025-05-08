import React, { useEffect, useState } from 'react';
import Wrapper from '../../Wrapper/wrapper';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../shared/Loading';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';
import TextInput from '../../../shared/TextInput'; 

const UpdateProduct = () => {
  const location = useLocation(); // Get the location object from useLocation
  const { productId } = location.state || {}; // Assuming the productId was passed through location.state
  const [auth] = useAuth();
  const [product, setProduct] = useState(null); // State to store product details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch product data by ID
  useEffect(() => {
    if (!productId) {
      toast.error('Product ID is missing');
      navigate('/dashboard');
      return;
    }

    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/v1/products/p/${productId}`);
        const productData = response.data.data;
        setProduct(productData);
        setName(productData.name);
        setDescription(productData.description);
        setBrand(productData.brand);
        setPrice(productData.price);
        setCategory(productData.category);
        setImages(productData.product_Images);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product details', error);
        toast.error('Failed to fetch product details');
        navigate('/dashboard');
      }
    };

    fetchProductData();
  }, [productId, navigate]);

  // Image upload to Cloudinary
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'PawsPoint_image');
    formData.append('cloud_name', 'dfjcqaurp');
    formData.append('folder', 'product_images');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dfjcqaurp/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      setImages(data.secure_url); // Set the uploaded image URL
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image!');
      setImages(''); // Clear image on failure
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!name || !brand || !price || !description || !category || !images) {
      return toast.error('Please fill out all fields');
    }

    try {
      // Update product data
      const updatedData = {
        name,
        brand,
        price,
        description,
        category,
        product_Images: images, // Use the updated image URL
      };

      const response = await axios.put(`${backend_url}/api/v1/products/p/${productId}`, updatedData);

      if (response.data.statusCode === 201) {
        toast.success('Product updated successfully');
        navigate('/dashboard'); // Redirect after successful product update
      } else {
        toast.error('Failed to update Product');
      }
    } catch (error) {
      console.error('Product update failed', error);
      toast.error('Product update failed. Please try again.');
    }
  };



  // Authentication check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth?.user && auth?.user?.user_Role === 'seller') {
        setIsLoading(false);
        toast.success('Authentication Successful');
      } else {
        navigate('/dashboard');
        toast.error('Authentication failed');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [auth, navigate]);

  if (isLoading || !product) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <div className="w-full bg-night flex flex-col justify-center items-center">
        <div className="h-fit w-4/5 bg-slate-800 flex flex-col justify-center items-center">
          <h1 className="text-emerald-400 text-2xl font-extrabold">UPDATE PRODUCT</h1>
          <form className="w-full flex flex-col justify-center items-center space-y-4" onSubmit={handleSubmit}>
            <TextInput
              title="Product Name"
              placeHolder="Enter your product name..."
              type="text"
              theme="light"
              value={name}
              setValue={setName}
            />
            <TextInput
              title="Product Description"
              placeHolder="Enter your product description..."
              type="text"
              theme="light"
              value={description}
              setValue={setDescription}
            />
            <TextInput
              title="Product Brand"
              placeHolder="Enter your product brand..."
              type="text"
              theme="light"
              value={brand}
              setValue={setBrand}
            />
            <TextInput
              title="Product Price"
              placeHolder="Enter your product price..."
              type="number"
              theme="light"
              value={price}
              setValue={setPrice}
            />
            <label htmlFor="categories" className="block mb-2 text-sm font-medium text-white">
              Select a category
            </label>
            <select
              id="categories"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Food">Food</option>
              <option value="Accessories">Accessories</option>
              <option value="Cages">Cages</option>
              <option value="Toys">Toys</option>
              <option value="Travel">Travel</option>
              <option value="Aquariums">Aquariums</option>
            </select>
            <div className="space-y-2 bg-yellow-200 p-1 rounded-lg">
              <div className="text-xs text-gray-600">Choose Image</div>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setPhoto(file);
                 
                  handleImageUpload(file);
                }}
                className="bg-yellow-200"
              />
              <img src={product?.product_Images}/>
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="product_photo"
                    className="h-24 w-24"
                  />
                </div>
              )}
            </div>
            <button
              className={`w-full h-12 text-white rounded-3xl transition duration-300 ${
                isUploading || !images
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              type="submit"
              disabled={isUploading || !images}
            >
              {isUploading ? 'Uploading...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default UpdateProduct;
