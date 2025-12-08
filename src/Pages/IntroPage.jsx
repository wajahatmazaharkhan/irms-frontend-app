import React from "react"; 
import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  TrendingUp,
  Award,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useTitle from "@/Components/useTitle";

const IntroPage = () => {
  useTitle('Home')
  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-slate-950 dark:text-slate-100">
      {/* Hero Section */}
      <header className="relative bg-[#2463EB] text-white overflow-hidden dark:bg-[#1D4ED8]">
        {/* Logo */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6">
          <img
            src="/logo-removebg-preview_06272023080455.png"
            alt="IISPPR Logo"
            className="h-16 w-auto md:h-24 lg:h-28"
          />
        </div>

        <div className="container mx-auto px-6 py-20 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
          >
            Empower Your Future with <br />
            <span className="text-[#F8F9FD] text-6xl md:text-7xl font-extrabold mt-2 block">
              IISPPR Internships
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-[#E2E8F0] mb-8 leading-relaxed"
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
              className="bg-white text-[#2463EB] px-8 py-3 rounded-nonelg hover:bg-[#F8F9FD] transition-colors flex items-center gap-2 shadow-md font-semibold dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
              onClick={() => (window.location.href = "/login")}
            >
              <GraduationCap className="w-5 h-5" />
              <span>Get Started</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Bio/Introduction Section */}
      <section className="bg-white py-16 px-6 md:px-12 lg:px-20 dark:bg-slate-900">
        <div className="container mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-center text-[#1E293B] mb-6 dark:text-slate-100"
          >
            About IISPPR
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg text-[#64748B] leading-relaxed text-justify dark:text-slate-400"
          >
            International Institute of SDGs and Public Policy Research specializes in Research and Development.
            Our major work includes comprehensive baselines studies concerning Education and Development. Our
            dedicated experts include researchers, policy analysts, educationists, and professionals from varied
            backgrounds. With their combined knowledge and experience, we aim to bring innovation and provide
            evidence-based recommendations to governments, NGOs, and all other stakeholders. As an institute
            dedicated to SDGs and public policy and affiliated with the Niti Ayog NGO Darpan portal, we prioritize
            capacity building and knowledge sharing.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-[#64748B] leading-relaxed mt-4 text-justify dark:text-slate-400"
          >
            By fostering collaboration and partnerships, we strive to create a network of change agents who can drive
            sustainable development and make a lasting impact on society. We engage in activities such as writing articles,
            publishing journals, and translating important research, all aimed at inspiring and pushing governments and
            individuals toward developing policies beneficial for everyone. Our research spans across fields such as
            biotechnology, content writing, graphic designing, human resources, journalism, and psychology.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg text-[#64748B] leading-relaxed mt-4 text-justify dark:text-slate-400"
          >
            We also emphasize building within the framework of SDG Goal 4 - Quality Education. Our agenda is to provide
            quality education to students, helping them develop essential skills and secure better employment opportunities.
            Additionally, we focus on reconnecting children who lost access to education due to the pandemic, ensuring their
            right to learn and grow.
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg text-[#64748B] leading-relaxed mt-4 text-justify dark:text-slate-400"
          >
            We believe in holistic development, including sustainability, gender equality, and humanitarian assistance.
            Our efforts in gender equality focus on SDG Goal 5, where we provide training and work opportunities for women
            to help them achieve financial independence and eradicate detrimental practices. Our research initiatives include
            topics such as gender pay gaps, political shifts, and sustainable industrial policies.
          </motion.p>
          
          <div className="flex justify-center mt-8">
            <button
              className="bg-[#2463EB] text-white px-8 py-3 rounded-nonelg hover:bg-[#1E4DB7] transition-colors flex items-center gap-2 shadow-lg font-semibold dark:bg-blue-500 dark:hover:bg-blue-400"
              onClick={() => (window.location.href = "/aboutus")}
            >
              <span>Read More</span>
            </button>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="bg-[#F8F9FD] py-16 dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="bg-[#EEF2FF] text-[#2463EB] px-4 py-1.5 rounded-nonefull text-sm font-medium dark:bg-slate-800 dark:text-blue-400">
              Our Achievements
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-6 text-[#1E293B] dark:text-slate-100">
              Trusted by <span className="text-[#2463EB] dark:text-blue-400">1000+ Students</span>
            </h2>
            <p className="text-[#64748B] max-w-3xl mx-auto text-lg dark:text-slate-400">
              Join 1000+ of learners around the globe who trust our platform to
              achieve their educational goals and build their future.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "2,800", label: "Students Enrolled" },
              { number: "4M+", label: "Views on YouTube" },
              { number: "1,200+", label: "Hours of Content" },
              { number: "95%", label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-[#F8F9FD] p-8 rounded-nonexl shadow-sm text-center dark:bg-slate-900 dark:shadow-none"
              >
                <h2 className="text-5xl font-bold text-[#2463EB] mb-3 dark:text-blue-400">
                  {stat.number}
                </h2>
                <p className="text-[#64748B] font-medium dark:text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#EEF2FF] p-2 rounded-nonefull mb-4 dark:bg-slate-800">
              <span className="bg-[#2463EB] p-2 rounded-nonefull dark:bg-blue-500">
                <Award className="w-5 h-5 text-white" />
              </span>
              <span className="text-[#2463EB] pr-2 font-medium dark:text-blue-400">
                Research Excellence
              </span>
            </div>
            <h2 className="text-4xl font-bold text-[#1E293B] mb-4 dark:text-slate-100">
              Become a Research Leader
            </h2>
            <p className="text-[#64748B] max-w-2xl mx-auto dark:text-slate-400">
              Connect with fellow researchers, share insights, and participate
              in groundbreaking studies. Enjoy comprehensive training and the
              opportunity to make real impact!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="bg-[#F8F9FD] p-6 rounded-nonexl shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900 dark:shadow-none dark:hover:shadow-md"
              >
                <div className="bg-[#EEF2FF] w-12 h-12 rounded-nonelg flex items-center justify-center mb-4 dark:bg-slate-800">
                  {React.cloneElement(feature.icon, {
                    className: "w-6 h-6 text-[#2463EB] dark:text-blue-400",
                  })}
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-2 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-[#F8F9FD] dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#1E293B] dark:text-slate-100">
            WHY YOU SHOULD JOIN IISPPR?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyJoinReasons.map((reason, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-nonexl shadow-sm dark:bg-slate-900"
              >
                <h3 className="text-2xl font-bold mb-4 text-[#1E293B] dark:text-slate-100">
                  {reason.title}
                </h3>
                <div className="h-1 w-16 bg-[#2463EB] mb-6 dark:bg-blue-500"></div>
                <p className="text-[#64748B] leading-relaxed dark:text-slate-400">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-[#94A3B8] py-16 dark:bg-slate-950 dark:text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <div className="bg-[#2463EB] p-2 rounded dark:bg-blue-500">II</div>
                <span className="font-bold">IISPPR</span>
              </div>
              <p className="text-sm">
                International Institute of SDGs and Public Policy Research
                specializes in Research and Development. Our major work includes
                comprehensive baselines and impactful research initiatives.
              </p>
              <div className="flex gap-4 mt-4">
                {[
                  {
                    icon: <Linkedin />,
                    href: "https://www.linkedin.com/company/international-institute-of-sdg-s-and-public-policy-research/",
                    hoverColor: "hover:text-[#0077B5]",
                  },
                  {
                    icon: <Twitter />,
                    href: "https://twitter.com/iispp_research",
                    hoverColor: "hover:text-[#1DA1F2]",
                  },
                  {
                    icon: <Facebook />,
                    href: "https://www.facebook.com",
                    hoverColor: "hover:text-[#4267B2]",
                  },
                  {
                    icon: <Instagram />,
                    href: "https://www.instagram.com/iisppr/?hl=en",
                    hoverColor: "hover:text-[#E4405F]",
                  },
                  {
                    icon: <Youtube />,
                    href: "https://www.youtube.com/@iisppr",
                    hoverColor: "hover:text-[#FF0000]",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-6 h-6 text-[#94A3B8] ${social.hoverColor} transition-colors dark:text-slate-400`}
                  >
                    {social.icon}
                  </a>
                ))}
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
                {["Home", "About Us", "Contact", "Internships"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {[
                  "Terms & Conditions",
                  "Privacy Policy",
                  "Disclaimer",
                  "Refund Policy",
                ].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2D3748] mt-12 pt-8 text-center dark:border-slate-700">
            <p>
              ©️ 2025 International Institute Of SDGS & Public Policy Research.
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Research Excellence",
    description: "Participate in groundbreaking research and win recognition",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Build Community",
    description: "Connect with fellow researchers and expand your network",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Focused Learning",
    description: "Access specialized training and mentorship programs",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Knowledge Sharing",
    description: "Share insights and learn from industry experts",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Career Growth",
    description: "Develop skills that advance your professional journey",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Leadership Development",
    description: "Build leadership capabilities through hands-on experience",
  },
];

const whyJoinReasons = [
  {
    title: "Potential Growth",
    description:
      "IISPPR contributes to an individual's potential growth by providing access to innovative research studies, comprehensive knowledge, and networking opportunities. It focuses on evidence-based research and policy analysis which helps in the development and execution of policies that promote social, economic, and environmental well-being.",
  },
  {
    title: "Enhancing Career Opportunities in Research",
    description:
      "Through its comprehensive and multidisciplinary public policy training, the International Institute of SDGs and Public Policy Research provides a unique platform for boosting career opportunities in research. New approaches to data analysis techniques, policy creation frameworks, and research methodologies are made available to participants.",
  },
  {
    title: "Flexible learning environment",
    description:
      "IISPPR has a flexible learning environment for fostering creativity and adaptability. It offers a variety of internships, fieldwork, research development courses, and publication opportunities to promote a dynamic learning environment.",
  },
  {
    title: "Learn the Policy Issue",
    description:
      "IISPPR provides a comprehensive framework for public policy and sustainable development goals SDGs that address complex global policy issues. Discussions on public policies, international policies, and treaties are conducted to emphasize a thorough understanding of the policy issues.",
  },
];

export default IntroPage;