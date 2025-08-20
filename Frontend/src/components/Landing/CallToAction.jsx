import React from "react";

function CallToAction({ openSignUp }) {
  return (
    // Main section container with the purple background and vertical padding
    <section className="bg-purple-600">
      <div className="container mx-auto px-6 py-12 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          {/* Text Content */}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-2 text-lg text-purple-200">
              Create your account today.
            </p>
          </div>

          {/* Action Button */}
          {/* Using flex-shrink-0 to prevent the button from shrinking on smaller screens */}
          <div className="flex-shrink-0">
            <button
              onClick={() => openSignUp()}
              className="
                px-8 py-3 
                bg-white 
                text-purple-700 font-semibold 
                rounded-lg shadow-md 
                hover:bg-gray-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white
                transition-colors duration-300
              "
            >
              Sign up for free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
