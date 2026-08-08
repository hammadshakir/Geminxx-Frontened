import express from "express";
const router = express.Router();

import Project from "../models/project.js"
// import Comment from "../models/comment"
// const catchAsync = require("../utils/catchAsync");
import AppError from "../utils/Error.js";

export async function ShowProjects (req, res, next) {
  const allProject = await Project.find({})
  // .populate("Comment");
  res.json(allProject);
}

export async function AddProject(req, res, next) {
  const {
    title,
    description,
    startingDate,
    DeadLine,
    progress,
    priority,
    category,
  } = req.body;

  if (!title || !description) {
    return next(new AppError("Title and description are required", 400));
  }

  const newProject = new Project({
    title,
    description,
    startingDate: startingDate || new Date(),
    DeadLine: DeadLine || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: progress || 0,
    priority: priority || "medium",
    category: category || "other",
  });

  const savedProject = await newProject.save();

  res.status(201).json({
    message: "Project added successfully",
    project: savedProject,
  });
}

export async function IndividualProject(req, res, next) {
  const { id } = req.params;
  const project = await Project.findById(id).populate("Comment");

  if (!project) {
    return next(new AppError("Project not found", 404));
  }
  res.json(project);

}

export async function EditProject(req, res) {
  const { id } = req.params;

  try {
   
    const project = await Project.findById(id); 
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project you are trying to edit does not exist"
      });
    }


    return res.json({
      success: true,
      message: "Project found successfully",
      project: project 
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID format"
    });
  }
}

export async function UpdateProject(req, res, next){
  const { id } = req.params;
  const { title, description, startingDate, DeadLine, progress, priority, category } = req.body;
  
  const updatedProject = await Project.findByIdAndUpdate(
    id,
    { title, description, startingDate, DeadLine, progress, priority, category },
    { 
      new: true, 
      runValidators: true 
    }
  );
  
  if (!updatedProject) {
    return next(new AppError("Project not found", 404));
  }
  
  res.json({ 
    message: "Project updated successfully", 
    project: updatedProject 
  })}

  export async function DeleteProject(req, res, next){
  const { id } = req.params;
  const deletedProject = await Project.findByIdAndDelete(id);
  
  if (!deletedProject) {
    return next(new AppError("Project not found", 404));
  }
  
  // Delete associated comments
  // await Comment.deleteMany({ _id: { $in: deletedProject.Comment } });
  
  res.json({ message: "Project deleted successfully", project: deletedProject });
}


