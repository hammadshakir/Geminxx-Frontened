import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      startingDate: formData.get('startingDate'),
      DeadLine: formData.get('DeadLine'),
      progress: formData.get('progress')
    };

    try {
      const response = await fetch("http://localhost:1000/api/new/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add project");
      }

      // Redirect to home page after successful addition
      navigate('/api/projects'); // or navigate('/home') depending on your route

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Add Project</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Enter Title" required />
        <br /> <br />
        
        <input name="description" placeholder="Enter Description" required />
        <br /> <br />
        
        <input name="startingDate" type="date" />
        <br /> <br />
        
        <input name="DeadLine" type="date" required />
        <br /> <br />
        
        <select name="progress" defaultValue="0">
          <option value="0">Not Started</option>
          <option value="25">Just Started</option>
          <option value="50">Working</option>
          <option value="75">Almost Done</option>
          <option value="100">Completed</option>
        </select>
        <br /> <br />
        
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>
    </>
  );
}