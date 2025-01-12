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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-gradient" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              IISPPR Internship Portal
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Transforming Research & Development through Structured Internships
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => navigate("/login")}
              >
                Get Started
                <GraduationCap className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full"
                onClick={() => navigate("/aboutus")}
              >
                Learn More
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "Active Interns", value: "500+" },
              { icon: Building2, label: "Research Labs", value: "15+" },
              { icon: Target, label: "Projects", value: "50+" },
              { icon: Award, label: "Success Rate", value: "95%" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-primary">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
