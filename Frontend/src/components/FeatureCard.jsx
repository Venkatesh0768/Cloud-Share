import { motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, description, iconColor, bgColor, highlight }) {
  return (
    <div className="h-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 flex flex-col">
      <div className="flex items-start mb-4">
        <div className={`p-3 rounded-lg ${bgColor} flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {highlight && (
          <span className="ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
            {highlight}
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 flex-grow">{description}</p>
      <motion.div 
        className="mt-4 text-purple-600 font-medium text-sm flex items-center cursor-pointer"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        Learn more
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.div>
    </div>
  );
}

export default FeatureCard;