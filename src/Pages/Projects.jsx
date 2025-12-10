import { useEffect, useState } from "react";
import { Navbar, Wrapper, Footer, useTitle } from "@/Components/compIndex";

const Projects = () => {
  useTitle("IISPPR | Projects");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/project/all`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);
          setProjects(data);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      <Wrapper>
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
          <div className="max-w-5xl px-4 pt-10 pb-36 mx-auto">
            {/* Header */}
            <div className="flex flex-col items-start mb-6 sm:flex-row sm:items-end sm:justify-between">
              <h1 className="mb-2 text-3xl font-bold text-slate-800 dark:text-slate-100">
                Projects
              </h1>
              {!loading && projects.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {projects.length} Active Project{projects.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Content states */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400">
                  Loading projects...
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No projects found. Please check back later!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="flex flex-col w-full mx-auto border-2 shadow-lg project-container md:flex-row
                               bg-slate-200 dark:bg-slate-800
                               border-slate-300 dark:border-slate-700
                               text-black dark:text-white
                               transition-colors duration-300"
                  >
                    {/* Left side: Image */}
                    <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-300 dark:border-slate-700 project-image">
                      <div className="relative w-full h-64 md:h-full">
                        <img
                          src={project.image}
                          alt="Project"
                          className="object-cover w-full h-full rounded-nonet-lg md:rounded-nonel-lg"
                        />
                      </div>
                    </div>

                    {/* Right side: Description */}
                    <div className="flex flex-col justify-between w-full p-4 md:w-2/3 project-description">
                      <div>
                        <div className="project-main-heading">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {project.title}
                          </h3>
                        </div>

                        {project.subTitle && (
                          <div className="mt-2 project-short-description">
                            <h5 className="text-lg text-slate-700 dark:text-slate-300">
                              {project.subTitle}
                            </h5>
                          </div>
                        )}

                        {project.description && (
                          <div className="mt-4 project-long-description">
                            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {project.description}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 project-by">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          By: {project.createdBy || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Wrapper>
      <Footer />
    </>
  );
};

export default Projects;