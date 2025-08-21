import React from 'react';
import { Star } from 'lucide-react';
import TestimonialCard from '../TestimonialCard';


const testimonialsData = [
  {
    name: "Sarah Johnson",
    title: "Marketing Director, CreativeMinds Inc.",
    quote: "CloudShare has transformed how our team collaborates on creative assets. The secure sharing and intuitive interface have made file management a breeze.",
    rating: 5,
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Michael Chen",
    title: "Freelance Designer, Self-employed",
    quote: "As a freelancer, I need to share large design files with clients securely. CloudShare's simple interface and reasonable pricing make it my go-to solution.",
    rating: 5,
    avatarUrl: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    name: "Priya Sharma",
    title: "Project Manager, TechSolutions Ltd.",
    quote: "Managing project files across multiple teams used to be a nightmare until we found CloudShare. Now everything is organized and accessible exactly when we need it.",
    rating: 4,
    avatarUrl: "https://randomuser.me/api/portraits/women/47.jpg",
  },
];



function Testimonial() {
  return (
    <div className="w-full bg-[#eeefff] py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Trusted by Professionals Worldwide
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            See what our users have to say about CloudShare
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={index} testimonial={testimonial}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonial;