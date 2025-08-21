import { CreditCard } from 'lucide-react';

function CreditDisplay({ credits = 0 }) {
  return (
    <button
      className="group flex items-center gap-2 rounded-full bg-blue-50 py-2 pl-3 pr-4 text-sm font-medium
                 text-blue-700 shadow-sm transition-all duration-200
                 hover:bg-blue-100 hover:shadow-md
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 active:scale-95"
      aria-label={`${credits} credits available`}
    >
      <CreditCard className="h-5 w-5 text-blue-500 transition-colors group-hover:text-blue-600" />
      <span>
        <span className="font-bold">{credits}</span>
        <span className="ml-1.5">Credits</span>
      </span>
    </button>
  );
}

export default CreditDisplay;