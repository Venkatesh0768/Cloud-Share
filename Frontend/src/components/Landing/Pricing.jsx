import { IndianRupee, Check } from "lucide-react";
import React from "react";
import { pricingPlans } from "../../assets/data";

function Pricing({ openSignUp }) {
  return (
    <div className="w-full bg-[#eeefff] py-5 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that's right for you.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative flex flex-col p-8 rounded-2xl border
                ${plan.isPopular 
                  ? 'bg-purple-50 border-2 border-purple-600 shadow-xl' 
                  : 'bg-white border-gray-200 shadow-sm'}
              `}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 right-8 bg-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-gray-500">{plan.description}</p>
              
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  ₹{plan.price}
                </span>
              </div>
              
              <hr className="my-8 border-gray-200" />
              
              {/* Features List */}
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-x-3">
                    <Check className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                onClick={()=> openSignUp()}
                className={`
                  w-full py-3 mt-auto rounded-lg font-semibold
                  ${plan.isPopular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-100 text-purple-700 hover:bg-gray-200'}
                `}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;