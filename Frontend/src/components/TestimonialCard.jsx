import React from 'react';
import { Star } from 'lucide-react';


const StarRating = ({ rating }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const isFilled = index < rating;
        return (
          <Star
            key={index}
            className={`h-5 w-5 ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={isFilled ? 'currentColor' : 'none'}
          />
        );
      })}
    </div>
  );
};


function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md flex flex-col h-full">
      <div className="flex items-center mb-4">
        <img
          className="w-14 h-14 rounded-full mr-4 object-cover"
          src={testimonial.avatarUrl}
          alt={testimonial.name}
        />
        <div>
          <p className="font-semibold text-lg text-gray-900">
            {testimonial.name}
          </p>
          <p className="text-gray-500">{testimonial.title}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <p className="text-gray-700 leading-relaxed">
        "{testimonial.quote}"
      </p>
    </div>
  );
}

export default TestimonialCard;