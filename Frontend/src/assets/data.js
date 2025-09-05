import {
  CreditCard,
  Files,
  LayoutDashboard,
  Receipt,
  Upload,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const testimonials = [
  // Original Data
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Self-employed",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote:
      "As a freelancer, I need to share large design files with clients securely. CloudShare's simple interface and robust security make it the perfect solution for my business.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Project Manager",
    company: "TechSolutions Ltd.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "Managing project files across multiple teams used to be a nightmare until we found CloudShare. It has streamlined our workflow and improved collaboration significantly.",
    rating: 4,
  },
  {
    name: "David Lee",
    role: "Small Business Owner",
    company: "Innovate & Co.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "CloudShare has been a game-changer for our business. We can now easily share our inventory and sales data with our team, keeping everyone in sync.",
    rating: 5,
  },
  {
    name: "Sarah Jones",
    role: "Marketing Coordinator",
    company: "Creative Minds Inc.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "The collaboration features are top-notch. Sharing campaign assets with my team and getting feedback has never been easier. Highly recommended!",
    rating: 4,
  },

  // New Data
  {
    name: "Elena Petrova",
    role: "University Student",
    company: "State University",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote:
      "CloudShare is essential for my group projects. We can all access and edit documents in real-time without worrying about version control. It saved us so much time.",
    rating: 5,
  },
  {
    name: "Kenji Tanaka",
    role: "Professional Photographer",
    company: "Tanaka Studios",
    image: "https://randomuser.me/api/portraits/men/51.jpg",
    quote:
      "Sharing high-resolution photo galleries with clients used to be slow and cumbersome. Now, I just send a secure CloudShare link. It's professional and incredibly fast.",
    rating: 5,
  },
  {
    name: "Fatima Al-Jamil",
    role: "IT Administrator",
    company: "Global Logistics",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    quote:
      "The admin dashboard gives me complete control over user permissions and data security. Deployment was seamless, and the reliability has been outstanding.",
    rating: 4,
  },
  {
    name: "Dr. Robert Harrison",
    role: "Lead Researcher",
    company: "BioHealth Labs",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    quote:
      "Our research generates massive datasets. CloudShare's platform handles our storage needs effortlessly and provides a secure way to share findings with international partners.",
    rating: 5,
  },
  {
    name: "Chloe Williams",
    role: "Legal Consultant",
    company: "Williams & Associates Law",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "Confidentiality is paramount in my line of work. CloudShare's end-to-end encryption gives me and my clients peace of mind when handling sensitive legal documents.",
    rating: 5,
  },
  {
    name: "Marco Rossi",
    role: "Video Editor",
    company: "Cineflex Productions",
    image: "https://randomuser.me/api/portraits/men/81.jpg",
    quote:
      "Transferring huge video files for review and approval is no longer a bottleneck in our workflow. The transfer speeds are excellent and the commenting feature is a huge plus.",
    rating: 4,
  },
];

export default testimonials;
export const pricingPlans = [
  {
    id: "free", // add this
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    features: [
      "5 file uploads",
      "Basic file sharing",
      "7-day file retention",
      "Email support",
    ],
    isPopular: false,
    buttonText: "Get Started",
  },
  {
    id: "premium",
    name: "Premium",
    credits: 500,
    description: "For individuals with larger needs",
    price: 500,
    features: [
      "500 file uploads",
      "Advanced file sharing",
      "30-day file retention",
      "Priority email support",
      "File analytics",
    ],
    isPopular: true,
    buttonText: "Go Premium",
  },
  {
    id: "ultimate",
    name: "Ultimate",
    credits: 5000,
    description: "For teams and businesses",
    price: 2500,
    features: [
      "5000 file uploads",
      "Team sharing capabilities",
      "Unlimited file retention",
      "24/7 priority support",
      "Advanced analytics",
      "API access",
    ],
    isPopular: false,
    buttonText: "Go Ultimate",
  },
];

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: "03",
    label: "My Files",
    icon: Files,
    path: "/myfiles",
  },
  {
    id: "04",
    label: "Subscriptions",
    icon: CreditCard,
    path: "/subscription",
  },
  {
    id: "05",
    label: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
];



export const SIDE_ADMIN_DATA = [
  { id: "01", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { id: "02", label: "Users", icon: Users, path: "/admin/users" },
  { id: "03", label: "Files", icon: Files, path: "/admin/files" },
  { id: "04", label: "Transactions", icon: Receipt, path: "/admin/transactions" },
];
