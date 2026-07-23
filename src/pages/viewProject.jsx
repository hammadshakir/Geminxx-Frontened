// pages/viewProject.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ViewProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:1000/api/projects/${_id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (_id) {
      fetchProject();
    }
  }, [_id]);

  // Delete project
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:1000/api/projects/${_id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      alert("Project deleted successfully!");
      navigate("/");
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  };

  if (loading) return <p>Loading project...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <button onClick={() => navigate("/")}>← Back to Home</button>
      
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {/* ✅ Edit Button */}
        <button 
          onClick={() => navigate(`/projects/${_id}/edit`)}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ffc107",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ✏️ Edit Project
        </button>
        
        {/* Delete Button */}
        <button 
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🗑️ Delete Project
        </button>
      </div>
      
      <h1>{project.title}</h1>
      <p><strong>Description:</strong> {project.description}</p>
      <p><strong>Start Date:</strong> {new Date(project.startingDate).toLocaleDateString()}</p>
      <p><strong>Deadline:</strong> {new Date(project.DeadLine).toLocaleDateString()}</p>
      <p><strong>Progress:</strong> {project.progress}%</p>
      
      {/* Progress Bar */}
      <div style={{ width: "100%", backgroundColor: "#f0f0f0", borderRadius: "10px", marginTop: "10px" }}>
        <div style={{
          width: `${project.progress}%`,
          backgroundColor: project.progress === 100 ? "green" : "blue",
          padding: "5px",
          borderRadius: "10px",
          color: "white",
          textAlign: "center"
        }}>
          {project.progress}%
        </div>
      </div>
    </div>
  );
}