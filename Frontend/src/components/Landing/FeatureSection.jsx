import FeatureCard from "../FeatureCard";
import {
  FileText,
  Shield,
  Share2,
  CreditCard,
  File,
  Clock,
  Zap,
  Cloud,
  Users,
  Globe,
  Bell,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";

// Animation Variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const headerVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

function FeatureSection() {
  const featureDetails = [
    {
      icon: FileText,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-100",
      title: "Easy File Upload",
      description:
        "Quickly upload your files with our intuitive drag-and-drop interface. Support for multiple file types and batch uploading.",
      highlight: "Drag & Drop",
    },
    {
      icon: Shield,
      iconColor: "text-green-500",
      bgColor: "bg-green-100",
      title: "Secure Storage",
      description:
        "Your files are encrypted with AES-256 and stored securely in our compliant cloud infrastructure with 99.9% uptime.",
      highlight: "AES-256 Encryption",
    },
    {
      icon: Share2,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100",
      title: "Simple Sharing",
      description:
        "Share files with anyone using secure, expirable links. Set passwords and access permissions with granular control.",
      highlight: "Expirable Links",
    },
    {
      icon: CreditCard,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-100",
      title: "Flexible Credits",
      description:
        "Pay only for what you use with our credit-based system. No subscriptions or hidden fees.",
      highlight: "Pay-Per-Use",
    },
    {
      icon: File,
      iconColor: "text-red-500",
      bgColor: "bg-red-100",
      title: "File Management",
      description:
        "Organize, preview, and manage your files from any device. Advanced search and filtering capabilities.",
      highlight: "Advanced Search",
    },
    {
      icon: Clock,
      iconColor: "text-cyan-500",
      bgColor: "bg-cyan-100",
      title: "Transaction History",
      description:
        "Keep track of all your credit purchases and usage with detailed, exportable reports.",
      highlight: "Exportable Reports",
    },
  ];

  return (
    <section
      id="features"
      className="w-full bg-gradient-to-b from-white to-[#f0f1ff] py-10 sm:py-24 lg:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16 lg:mb-20"
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 mb-6">
            <Zap className="w-4 h-4 mr-2" /> Powerful Features
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Everything you need for secure file sharing
          </h2>
          <p className="mt-6 text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            CloudShare provides enterprise-grade tools to manage, share, and
            protect your digital content with ease and confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featureDetails.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.iconColor}
                bgColor={feature.bgColor}
                highlight={feature.highlight}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeatureSection;
