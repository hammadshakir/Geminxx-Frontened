// pages/editProject.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProject() {
  const [project, setProject] = useState({
    title: "",
    description: "",
    startingDate: "",
    DeadLine: "",
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { _id } = useParams();
  const navigate = useNavigate();

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:1000/api/projects/${_id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        
        const data = await response.json();
        
        // Format dates for input fields
        setProject({
          title: data.title || "",
          description: data.description || "",
          startingDate: data.startingDate ? new Date(data.startingDate).toISOString().split('T')[0] : "",
          DeadLine: data.DeadLine ? new Date(data.DeadLine).toISOString().split('T')[0] : "",
          progress: data.progress || 0
        });
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:1000/api/projects/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      const data = await response.json();
      console.log("✅ Project updated:", data);
      
      // View page par redirect karein
      navigate(`/projects/${_id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <button onClick={() => navigate("/")}>← Back to Home</button>
        <p>Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <button onClick={() => navigate("/")}>← Back to Home</button>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <button onClick={() => navigate(`/projects/${_id}`)}>← Back to Project</button>
      
      <h1>Edit Project</h1>
      
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label><strong>Title:</strong></label>
          <input
            type="text"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label><strong>Description:</strong></label>
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label><strong>Start Date:</strong></label>
          <input
            type="date"
            name="startingDate"
            value={project.startingDate}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label><strong>Deadline:</strong></label>
          <input
            type="date"
            name="DeadLine"
            value={project.DeadLine}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label><strong>Progress: {project.progress}%</strong></label>
          <input
            type="range"
            name="progress"
            min="0"
            max="100"
            value={project.progress}
            onChange={handleChange}
            style={{ width: "100%", marginTop: "5px" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{
              padding: "10px 20px",
              backgroundColor: saving ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: saving ? "not-allowed" : "pointer"
            }}
          >
            {saving ? "Saving..." : "Update Project"}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate(`/projects/${_id}`)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}