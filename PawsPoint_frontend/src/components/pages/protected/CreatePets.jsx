import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../shared/Loading';
import Wrapper from '../../Wrapper/wrapper';
import { toast } from 'react-toastify';
import TextInput from '../../../shared/TextInput';
import axios from 'axios';
import { backend_url } from '../../../utils/Config';

const CreatePets = () => {
  const [auth] = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photo, setPhoto] = useState('');
  const [images, setImage] = useState('');
  const [petCategories, setPetCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'PawsPoint_image');
    formData.append('cloud_name', 'dfjcqaurp');
    formData.append('folder', 'pet_images');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dfjcqaurp/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      setImage(data.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image!');
      setImage('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!name || !price || !description || !category || !images) {
      return toast.error('Please fill out all required fields');
    }

    // Create the data object to send to the backend
    const data = {
      pet_Type: category,  // Send a single string (category selected by the user)
      breed_Name: name,    // Use name as the breed name
      pet_Images: [images], // Send the uploaded image URL as an array
      pet_Description: description,
      pet_Age: 1,          // Default age is 1 (or you can update as needed)
      price: price,
    };

    try {
      const response = await axios.post(`${backend_url}/api/v1/pets/new`, data);

      if (response.data.statusCode === 201) {
        toast.success('Pet created successfully');
        navigate('/dashboard');
      } else {
        toast.error('Failed to create pet');
      }
    } catch (error) {
      console.error('Pet creation failed', error);
      toast.error('Pet creation failed. Please try again.');
    }
  };

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

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Wrapper>
      <div className="w-full bg-night flex flex-col justify-center items-center">
        <div className="h-fit w-4/5 bg-slate-800 flex flex-col justify-center items-center">
          <h1 className="text-emerald-400 text-2xl font-extrabold">CREATE PET</h1>
          <form className="w-full flex flex-col justify-center items-center space-y-4" onSubmit={handleSubmit}>
            <TextInput
              title="Pet Name"
              placeHolder="Enter pet name..."
              type="text"
              theme={theme}
              value={name}
              setValue={setName}
            />
            <TextInput
              title="Description"
              placeHolder="Enter description..."
              type="text"
              theme={theme}
              value={description}
              setValue={setDescription}
            />
            <TextInput
              title="Price"
              placeHolder="Enter price..."
              type="number"
              theme={theme}
              value={price}
              setValue={setPrice}
            />

            <label htmlFor="categories" className="block mb-2 text-sm font-medium text-white">
              Select a category
            </label>
            <select
              id="categories"
              onChange={(e) => setCategory(e.target.value)} // Set category as a single string
              required
              className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected disabled>Choose a category</option>
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Fish">Fish</option>
              <option value="Bird">Bird</option>
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
                required
                className="bg-yellow-200"
              />
              {photo && (
                <div className="text-center">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="pet_photo"
                    className="h-24 w-24"
                  />
                </div>
              )}
            </div>

            <button
              className={`w-full h-12 text-white rounded-3xl transition duration-300 ${isUploading || !images
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
              }`}
              type="submit"
              disabled={isUploading || !images}
            >
              {isUploading ? 'Uploading...' : 'Create Pet'}
            </button>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};

export default CreatePets;
