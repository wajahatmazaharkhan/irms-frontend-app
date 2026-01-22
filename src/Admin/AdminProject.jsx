import { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";
import { ChevronDown } from "lucide-react";

const AdminProject = () => {
  useTitle("Project Management");

  const emptyProject = {
    title: "",
    subTitle: "",
    description: "",
    image: null,
    createdBy: "",
    projectType: "",
    projectCategory: "",
  };

  const [project, setProject] = useState(emptyProject);
  const [postedProjects, setPostedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ------------------ Input handler ------------------ */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setProject({ ...project, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setProject({ ...project, [name]: value });
    }
  };

  /* ------------------ Validation ------------------ */
  const validate = () => {
    if (!project.title || !project.subTitle || !project.description) {
      setError("Title, subtitle & description are required.");
      return false;
    }
    return true;
  };

  /* ------------------ Create / Update ------------------ */
  const handlePostProject = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      Object.entries(project).forEach(([k, v]) => {
        if (k === 'projectCategory' && v === 'Other') {
          formData.append(k, project.customCategory || 'Uncategorized');
        } else if (k !== 'customCategory') {
          formData.append(k, v);
        }
      });

      const url = editingId
        ? `${import.meta.env.VITE_BASE_URL}/project/update/${editingId}`
        : `${import.meta.env.VITE_BASE_URL}/project/submit`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (editingId) {
        setPostedProjects((prev) =>
          prev.map((p) => (p._id === editingId ? data : p))
        );
      } else {
        setPostedProjects((prev) => [data, ...prev]);
      }

      setProject(emptyProject);
      setPreview(null);
      setEditingId(null);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Delete ------------------ */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project permanently?")) return;

    setPostedProjects((prev) => prev.filter((p) => p._id !== id));

    await fetch(`${import.meta.env.VITE_BASE_URL}/project/delete/${id}`, {
      method: "DELETE",
    });
  };

  /* ------------------ Load ------------------ */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/project/all`);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.warn("Session expired or unauthorized");
            // Optionally redirect to login or show specific message
            setError("Session expired. Please login again.");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setPostedProjects(data);
        } else {
          console.error("Received invalid data format:", data);
          setPostedProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
        setPostedProjects([]);
      }
    };

    fetchProjects();
  }, []);

  /* ------------------ Edit ------------------ */
  const startEdit = (p) => {
    const standardCategories = ["HR", "Research", "Social Media", "Marketing", "Development"];
    const isCustom = p.projectCategory && !standardCategories.includes(p.projectCategory);

    setProject({
      title: p.title,
      subTitle: p.subTitle,
      description: p.description,
      image: null,
      createdBy: p.createdBy,
      projectType: p.projectType || "",
      projectCategory: isCustom ? "Other" : (p.projectCategory || ""),
      customCategory: isCustom ? p.projectCategory : "",
    });
    setPreview(p.image);
    setEditingId(p._id);
  };

  return (
    <>
      <CustomNavbar />

      <div className="flex flex-col md:flex-row h-[calc(100vh-4.5rem)] p-5 gap-5 bg-gray-100">
        {/* LEFT FORM */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-xl p-6 space-y-4 overflow-y-auto pb-20">
          <h2 className="text-xl font-bold text-blue-600">
            {editingId ? "Edit Project" : "Create Project"}
          </h2>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          {/* Image */}
          <input type="file" name="image" onChange={handleChange} />

          {preview && (
            <img
              src={preview}
              className="h-32 w-full object-cover rounded-lg"
            />
          )}

          <input
            name="title"
            value={project.title}
            onChange={handleChange}
            placeholder="Project title"
            className="w-full p-3 border rounded"
          />

          <input
            name="subTitle"
            value={project.subTitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="w-full p-3 border rounded"
          />

          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description"
            className="w-full p-3 border rounded"
          />

          <input
            name="createdBy"
            value={project.createdBy}
            onChange={handleChange}
            placeholder="Team name"
            className="w-full p-3 border rounded"
          />

          <div className="relative">
            <select
              name="projectType"
              value={project.projectType}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Project Type</option>
              <option value="Batch-wise">Batch-wise</option>
              <option value="Independent">Independent</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              name="projectCategory"
              value={project.projectCategory}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white text-gray-700 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Project Category</option>
              <option value="HR">HR</option>
              <option value="Research">Research</option>
              <option value="Social Media">Social Media</option>
              <option value="Marketing">Marketing</option>
              <option value="Development">Development</option>
              <option value="Other">Other (Add New)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          {project.projectCategory === "Other" && (
            <input
              name="customCategory"
              value={project.customCategory || ""}
              onChange={handleChange}
              placeholder="Enter new category name"
              className="w-full p-3 border rounded bg-blue-50 focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          )}

          <button
            onClick={handlePostProject}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : editingId ? "Update" : "Publish"}
          </button>
        </div>

        {/* RIGHT LIST */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-xl p-6 overflow-auto">
          <h2 className="text-xl font-bold text-blue-600 mb-4">
            Posted Projects
          </h2>

          {postedProjects.length === 0 ? (
            <p className="text-center text-gray-400">
              No projects yet — publish one.
            </p>
          ) : (
            postedProjects.map((p) => (
              <div
                key={p._id}
                className="flex items-center gap-4 p-3 border rounded-lg mb-3"
              >
                <img src={p.image} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.subTitle}</p>
                  {p.projectType && (
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${p.projectType === 'Batch-wise'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-teal-100 text-teal-700'
                      }`}>
                      {p.projectType}
                    </span>
                  )}
                  {p.projectCategory && (
                    <span className="inline-block mt-1 ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {p.projectCategory}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => startEdit(p)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProject;
