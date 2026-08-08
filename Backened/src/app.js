import express from "express";
import cors from "cors";
import AppError from "../src/utils/Error.js"
import devRouter from "./routes/dev.routes.js"
import commentRouter from "./routes/comment.routes.js"
import userRouter from "./routes/user.routes.js";


const app = express()

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/api",devRouter)
app.use("/api", commentRouter);
app.use("/api/user", userRouter);  

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error = new AppError(message, 404);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `Duplicate value for ${field}. Please use another value.`;
    error = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input: ${errors.join('. ')}`;
    error = new AppError(message, 400);
  }

  console.error('❌ Error:', err);

  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode || 500).json({
      status: error.status,
      message: error.message,
      stack: error.stack,
      error: error
    });
  } else {
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
});

export default app