import { useEffect, useState } from "react";
import CustomNavbar from "./CustomNavbar";
import useTitle from "@/Components/useTitle";

const AdminProject = () => {
  useTitle("Project Management");

  const emptyProject = {
    title: "",
    subTitle: "",
    description: "",
    image: null,
    createdBy: "",
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
      Object.entries(project).forEach(([k, v]) => formData.append(k, v));

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
    fetch(`${import.meta.env.VITE_BASE_URL}/project/all`)
      .then((r) => r.json())
      .then(setPostedProjects);
  }, []);

  /* ------------------ Edit ------------------ */
  const startEdit = (p) => {
    setProject({
      title: p.title,
      subTitle: p.subTitle,
      description: p.description,
      image: null,
      createdBy: p.createdBy,
    });
    setPreview(p.image);
    setEditingId(p._id);
  };

  return (
    <>
      <CustomNavbar />

      <div className="flex flex-col md:flex-row h-screen p-5 gap-5 bg-gray-100">
        {/* LEFT FORM */}
        <div className="md:w-1/2 bg-white rounded-xl shadow-xl p-6 space-y-4">
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
