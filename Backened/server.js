import "./src/config/dns.js";
import app from "./src/app.js";
import ConnectDB from "./src/config/database.js";

// DB Connection

async function startServer() {
  try {
    await ConnectDB();

    app.listen(1000, () => {
      console.log("Server is running on port 1000");
    });

  } catch (error) {
    console.error("Database connection failed:", error);
  }
}


startServer()