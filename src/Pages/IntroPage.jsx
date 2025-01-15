import React from 'react';
import { GraduationCap, Users, Target, BookOpen, TrendingUp, Award, Linkedin, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle,
  MessageCircle,
  ClipboardList,
  ChartBar,
  FileText,
  Building2
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
const IntroPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
{/* Hero Section */}
<header className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white overflow-hidden">
  {/* Logo */}
  <div className="absolute top-4 left-4">
    <img
      src="/logo-removebg-preview_06272023080455.png"
      alt="IISPPR Logo"
      className="h-40 w-auto"
    />
  </div>
  {/* Logo */}
  <div className="absolute top-4 right-4">
    <img
      src="/logo-removebg-preview_06272023080455.png"
      alt="IISPPR Logo"
      className="h-40 w-auto"
    />
  </div>
  <div className="container mx-auto px-6 py-24 text-center relative z-10">
    <motion.h1
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="text-6xl font-extrabold tracking-tight mb-6"
    >
      Empower Your Future with <br /> 
      <span className="text-yellow-400 text-7xl md:text-8xl font-bold">IISPPR Internships</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="text-lg md:text-2xl text-gray-200 mb-8 leading-relaxed"
    >
      Pioneering Excellence in Research & Development <br /> 
      Through Impactful, Structured Internships.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="flex flex-wrap justify-center gap-4"
    >
      <button
        className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors flex items-center gap-2 shadow-lg transform hover:scale-105"
      >
        <GraduationCap className="w-6 h-6" />
        <li>
          <a href="/login" className="hover:text-white transition-colors">Get Started</a>
        </li>
      </button>
    </motion.div>
  </div>
</header>
      {/* Stats Section */}
<section className="bg-gradient-to-br from-[#1A1F2C] to-[#242937] text-white py-20">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <span className="bg-blue-600/50 text-blue-300 px-5 py-2 rounded-full text-sm tracking-wide shadow-md">
        Our Achievements
      </span>
      <h2 className="text-5xl font-extrabold mt-4 mb-6">
        Trusted by <span className="text-yellow-400">1000+ Students</span>
      </h2>
      <p className="text-gray-300 max-w-3xl mx-auto text-lg">
        Join 1000+ of learners around the globe who trust our platform to achieve their educational goals and build their future.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-[#2D3345] p-10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-6xl font-bold text-yellow-400 mb-4">2,800</h2>
        <p className="text-gray-400 text-lg">Students Enrolled</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-[#2D3345] p-10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-6xl font-bold text-yellow-400 mb-4">4M+</h2>
        <p className="text-gray-400 text-lg">Views on YouTube</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-[#2D3345] p-10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-6xl font-bold text-yellow-400 mb-4">1,200+</h2>
        <p className="text-gray-400 text-lg">Hours of Content</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-[#2D3345] p-10 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-6xl font-bold text-yellow-400 mb-4">95%</h2>
        <p className="text-gray-400 text-lg">Satisfaction Rate</p>
      </motion.div>
    </div>
  </div>
</section>
      {/* Features Grid */}
      <section className="py-20 bg-[#0A0F1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-900/20 p-2 rounded-full mb-4">
              <span className="bg-blue-500 p-2 rounded-full">
                <Award className="w-5 h-5 text-white" />
              </span>
              <span className="text-blue-300 pr-2">Research Excellence</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Become a Research Leader</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Connect with fellow researchers, share insights, and participate in groundbreaking studies.
              Enjoy comprehensive training and the opportunity to make real impact!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-[#1A1F2C] p-6 rounded-lg group hover:bg-blue-900/20 transition-colors"
              >
                <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Why Join Section */}
      <section className="py-20 bg-white">
        
        <div className="container mx-auto px-4">
          
          <h2 className="text-4xl font-bold text-center mb-16">WHY YOU SHOULD JOIN IISPPR?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyJoinReasons.map((reason, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-8 rounded-lg shadow-lg"
              >
                {/* Logo */}
  <div className="absolute top-4 left-4">
    <img
      src="/logo-removebg-preview_06272023080455.png"
      alt="IISPPR Logo"
      className="h-9 w-auto"
    />
  </div>
                <h3 className="text-2xl font-bold mb-4">{reason.title}</h3>
                <div className="h-1 w-16 bg-blue-500 mb-6"></div>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

{/* Call to Action */}
<section className="py-20 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white">
  <div className="container mx-auto px-4 text-center">
    {/* Heading and Description */}
    <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
    <p className="text-white/90 mb-8 max-w-2xl mx-auto">
      Join IISPPR's internship program and be part of groundbreaking research in sugarcane and power plant technology.
    </p>
    {/* Video Section */}
    <div className="mb-8">
      <video
        src="Registration-and-Receiving-of-ID-Card-and-LOA.mp4"
        controls
        className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
      >
        Your browser does not support the video tag.
      </video>
    </div>
    {/* Call to Action Button */}
    <button
  onClick={() => (window.location.href = "https://iisppr.in/users-apply-form.php")}
  className="bg-white text-blue-700 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
>
  <GraduationCap className="w-5 h-5" />
  Apply Now
</button>
  </div>
</section>
{/* Website Designed by Interns Section */}
<section className="bg-gradient-to-br from-gray-100 to-gray-200 py-20 overflow-hidden">
  <div className="container mx-auto px-6">
    {/* Section Title */}
    <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
      Website Designed by the Below Interns
    </h2>

    {/* Floating Profiles */}
    <div className="relative">
      <div className="flex gap-8 animate-marquee">
        {[
          { name: "Viral🕵 ", role: "Team Lead" },
          { name: "Bhaskar", role: "Front End Developer" },
          { name: "Bhavish", role: "Front End Developer" },
          { name: "Shivam", role: "Front End Developer" },
          { name: "Lakshmi", role: "Front End Developer" },
          { name:"Arya",role:"Front End Developer" },
          { name:"Khushi ",role:"Front End Developer" },
          { name:"Ashish ",role:"Back End Developer" },
          { name:"Pravin ",role:"Back End Developer" },
          { name:"Nadeem",role:"Back End Developer" },
          { name:"Sanjula ",role:"Back End Developer" },
          { name:"Sri Haripriyan ",role:"Back End Developer" },
          { name:"Ishika  ",role:"Back End Developer" },
          { name:"UJJWAL ",role:"Back End Developer" },
          { name:"Anil ",role:"Back End Developer" },
        ].map((intern, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-2xl transition-shadow w-64"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-white">
                {intern.name.charAt(0)}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {intern.name}
            </h3>
            <p className="text-gray-600">{intern.role}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  {/* Add Animation for Floating Effect */}
  {/* Add Animation for Floating Effect */}
  <style jsx>{`
    @keyframes marquee {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
    .animate-marquee {
      display: flex;
      gap: 2rem;
      animation: marquee 15s linear infinite;
    }
  `}</style>
</section>
      {/* Footer */}
      <footer className="bg-[#0A0F1A] text-gray-400 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <div className="bg-blue-500 p-2 rounded">II</div>
                <span className="font-bold">IISPPR</span>
              </div>
              <p className="text-sm">
                International Institute of SDGs and Public Policy Research specializes in Research and Development. Our major work includes comprehensive baselines and impactful research initiatives.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-6 h-6 text-gray-400 hover:text-pink-500 transition-colors" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-6 h-6 text-gray-400 hover:text-red-600 transition-colors" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <address className="not-italic">
                <p>Office No. 30 Nihad Plaza, Opposite</p>
                <p>Zakir Hussain School, Civil lines, Near</p>
                <p>AMU, Aligarh 202001</p>
                <p className="mt-4">+918279616047</p>
                <p>iisspresearch@gmail.com</p>
              </address>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Internships</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/privacypolicy" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>© 2025 International Institute Of SDGS & Public Policy Research. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
const features = [
  {
    icon: <Award className="w-6 h-6 text-blue-300" />,
    title: "Research Excellence",
    description: "Participate in groundbreaking research and win recognition"
  },
  {
    icon: <Users className="w-6 h-6 text-blue-300" />,
    title: "Build Community",
    description: "Connect with fellow researchers and expand your network"
  },
  {
    icon: <Target className="w-6 h-6 text-blue-300" />,
    title: "Focused Learning",
    description: "Access specialized training and mentorship programs"
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-300" />,
    title: "Knowledge Sharing",
    description: "Share insights and learn from industry experts"
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-300" />,
    title: "Career Growth",
    description: "Develop skills that advance your professional journey"
  },
  {
    icon: <GraduationCap className="w-6 h-6 text-blue-300" />,
    title: "Leadership Development",
    description: "Build leadership capabilities through hands-on experience"
  }
];
const whyJoinReasons = [
  {
    title: "Potential Growth",
    description: "IISPPR contributes to an individual's potential growth by providing access to innovative research studies, comprehensive knowledge, and networking opportunities. It focuses on evidence-based research and policy analysis which helps in the development and execution of policies that promote social, economic, and environmental well-being."
  },
  {
    title: "Enhancing Career Opportunities in Research",
    description: "Through its comprehensive and multidisciplinary public policy training, the International Institute of SDGs and Public Policy Research provides a unique platform for boosting career opportunities in research. New approaches to data analysis techniques, policy creation frameworks, and research methodologies are made available to participants."
  },
  {
    title: "Flexible learning environment",
    description: "IISPPR has a flexible learning environment for fostering creativity and adaptability. It offers a variety of internships, fieldwork, research development courses, and publication opportunities to promote a dynamic learning environment."
  },
  {
    title: "Learn the Policy Issue",
    description: "IISPPR provides a comprehensive framework for public policy and sustainable development goals SDGs that address complex global policy issues. Discussions on public policies, international policies, and treaties are conducted to emphasize a thorough understanding of the policy issues."
  }
];
export default IntroPage;
