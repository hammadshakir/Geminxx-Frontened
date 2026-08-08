// src/hooks/useFetch.js (example)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => {
            navigate("/error", { 
              state: { 
                statusCode: res.status, 
                message: errData.message || errData.error,
                customMessage: "We couldn't fetch the data you requested."
              } 
            });
            throw new Error(errData.message || "API Error");
          });
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        // Agar network error hai toh bhi Error Page dikhao
        if (!err.response) {
          navigate("/error", { 
            state: { 
              statusCode: 0, 
              message: "Network Error", 
              customMessage: "Please check your internet connection." 
            } 
          });
        }
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
};

export default useFetch;