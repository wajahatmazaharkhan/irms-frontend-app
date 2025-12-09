import React, { useEffect, useRef } from "react";
import { TopNavbar, Navbar, useTitle } from "../Components/compIndex";

const Aboutus = () => {
  useTitle('About Us')
  const aboutusRef = useRef(null);

  // for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-counsellor-card");
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    const cards = document.querySelectorAll(".aboutus-card");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <TopNavbar />
      <br></br>
      <br></br>
      <div className="ml-16 aboutus-container sm:ml-64 px-6 md:px-12 lg:px-20">
        <div className="mb-10 about-us-description">
          <h3 className="text-3xl font-bold">IISPPR</h3>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            International Institute of SDGs and Public Policy Research specializes in Research and Development.
            Our major work includes comprehensive baselines studies concerning Education and Development. 
            Our dedicated experts include researchers, policy analysts, educationists, and professionals 
            from varied backgrounds. With their combined knowledge and experience, we aim to bring in innovation 
            and provide evidence-based recommendations to governments, NGOs, and all other stakeholders.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            As an institute dedicated to SDGs and public policy and affiliated with the Niti Ayog NGO Darpan portal, 
            we prioritize capacity building and knowledge sharing. By fostering collaboration and partnerships, we strive 
            to create a network of change agents who can drive sustainable development and make a lasting impact on society. 
            By writing articles, publishing journals, translating, and using other media, we feel it is our responsibility to 
            inspire and push governments and individuals to develop policies that are beneficial to everyone.
          </p>
        </div>

        {/* CEO Section */}
        <div className="flex flex-col md:flex-row items-center mb-10 ceo-section">
          <img
            src={""} 
            alt="CEO"
            className="w-32 h-32 mr-6 rounded-nonefull ceo-image"
          />
          <div className="ceo-info text-center md:text-left">
            <h3 className="text-2xl font-semibold">Nikhil Surjuse</h3>
            <p className="text-lg">Founder & CEO</p>
            <p className="text-base text-[#64748B]">
              Founder of Connect Counsellor. Experienced counsellor.
            </p>
          </div>
        </div>

        <div className="mb-10 text-center slogan-section">
          <h2 className="text-2xl font-bold">MEET YOUR COUNSELLORS</h2>
        </div>

        {/* About Us Counsellors Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 aboutus-section" ref={aboutusRef}>
          {[
            { name: "Rajashree Navthale", title: "Counsellor and Psychotherapist", experience: "Experienced counsellor and psychotherapist with more than 2 years of experience" },
            { name: "Anupma Joshirao", title: "Counsellor", experience: "Experienced counsellor" },
            { name: "Shweta Surjuse", title: "Counsellor", experience: "Having Experience of 2.5 years in Counselling." }
          ].map((person, index) => (
            <div key={index} className="aboutus-card p-4 shadow-md rounded-nonelg bg-white">
              <img
                src={""} 
                alt={person.name}
                className="object-cover w-full h-48 rounded"
              />
              <h3 className="mt-4 text-xl font-semibold">{person.name}</h3>
              <p className="text-base">{person.title}</p>
              <p className="mt-2 text-sm italic text-[#64748B]">{person.experience}</p>
            </div>
          ))}
        </div>

        {/* Thought Section */}
        <div className="mt-10 text-center thought-section">
          <p className="text-lg italic text-[#64748B]">
            "We are a dedicated team of experienced doctors committed to providing exceptional care and support to enhance the well-being of our community."
          </p>
        </div>

        {/* Additional Information Section */}
        <div className="mt-10 about-us-info">
          <h3 className="text-2xl font-bold text-[#1E293B]">Our Mission</h3>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            Our goal is to provide humanitarian assistance in these areas further. Helping young people 
            to access education and further training and research facilities is among our primary goals. 
            We emphasize SDG Goal 4 - Quality Education. The agenda of our institution is to provide quality 
            education to all students, ensuring their right to learn and grow.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            We also strive to create an inclusive environment and engage in promoting women's education 
            for accelerating Gender equality (SDG Goal 5). Our focus is to enable women to achieve 
            financial independence by providing them opportunities and eradicating any detrimental practices.
          </p>
        </div>

        {/* Work Section */}
        <div className="mt-10 about-us-work">
          <h3 className="text-2xl font-bold text-[#1E293B]">Our Work</h3>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            The International Institute of Sustainable Development Goals (SDGs) and Public Policy is relentless 
            in its quest for unmatched quality across all of its endeavours. Our core ideas include policy analysis 
            in a multidisciplinary approach, focusing on sustainable development, industrial ecology, public policy, 
            and international relations.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-justify text-[#64748B]">
            Our work includes gender-related issues such as the gender pay gap, international politics, 
            and foreign policy analysis. We also actively generate funds for underprivileged people, 
            providing assistance during calamities or natural disasters.
          </p>
          <br></br>
          <br></br>
          <br></br>
        </div>

      </div>
    </>
  );
};

export default Aboutus;
