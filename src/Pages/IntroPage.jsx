import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  MessageCircle,
  GraduationCap,
  ClipboardList,
  ChartBar,
  FileText,
  Building2,
  Target
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";

const IntroPage = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Comprehensive Internship Management</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform provides end-to-end solutions for managing internships, from onboarding to certification
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Smart Onboarding",
              description: "Streamlined process for intern registration and department allocation"
            },
            {
              icon: <Calendar className="w-6 h-6 text-primary" />,
              title: "Attendance Tracking",
              description: "Automated attendance system with real-time monitoring"
            },
            {
              icon: <ClipboardList className="w-6 h-6 text-primary" />,
              title: "Project Management",
              description: "Track and manage research projects and assignments"
            },
            {
              icon: <ChartBar className="w-6 h-6 text-primary" />,
              title: "Performance Analytics",
              description: "Detailed insights into intern performance and progress"
            },
            {
              icon: <MessageCircle className="w-6 h-6 text-primary" />,
              title: "Communication Hub",
              description: "Integrated messaging system for mentors and interns"
            },
            {
              icon: <FileText className="w-6 h-6 text-primary" />,
              title: "Documentation",
              description: "Digital management of reports and certificates"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
{/* Video Section */}
<div className="bg-card py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.0 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold mb-4">How to Apply and Get Your ID Card</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        Watch the video below to learn how to apply for internships and receive your ID card.
      </p>
    </motion.div>

    <div className="flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        <video
          controls
          className="w-full max-w-3xl rounded-lg"
        >
          <source src="/Registration-and-Receiving-of-ID-Card-and-LOA.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  </div>
</div>


      {/* CTA Section */}
      <div className="bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join IISPPR's internship program and be part of groundbreaking research in sugarcane and power plant technology
            </p>
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={() => (window.location.href = "https://iisppr.org.in/internship-jd/")}

            >
              Apply Now
              <GraduationCap className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
    
  );
};

export default IntroPage;