import React from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../Wrapper/wrapper';

const categories = [
  { name: 'Dog', emoji: '🐶' },
  { name: 'Cat', emoji: '🐱' },
  { name: 'Rabbit', emoji: '🐰' },
  { name: 'Bird', emoji: '🐦' },
  { name: 'Fish', emoji: '🐠' },
];

const testimonials = [
  {
    name: 'Aisha R.',
    comment: 'Adopting my puppy from here was the best decision! So happy.',
    emoji: '❤️🐶',
  },
  {
    name: 'Karan M.',
    comment: 'Great selection of pets and amazing service!',
    emoji: '🌟🐾',
  },
  {
    name: 'Priya D.',
    comment: 'Smooth process and very caring sellers. Highly recommend!',
    emoji: '😊🐱',
  },
];

const Buypets = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (type) => {
    navigate(`/services/buy-pets/${type}`);
  };

  return (
    <Wrapper>
      <div className="bg-gray-900 text-white min-h-screen py-10">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Buy Pets by Category
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="bg-gray-800 hover:bg-gray-700 rounded-2xl shadow-lg transition duration-300 p-6 text-center cursor-pointer"
            >
              <div className="text-6xl mb-4">{category.emoji}</div>
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="mt-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-8">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="text-2xl mb-2">{testimonial.emoji}</div>
                <p className="text-lg italic mb-4">"{testimonial.comment}"</p>
                <p className="font-semibold text-right">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Buypets;
