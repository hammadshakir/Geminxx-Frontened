import mongoose from "mongoose" 
const Schema = mongoose.Schema;

const newProject = new Schema({
  title: String,
  description: String,
  startingDate: Date,
  DeadLine: Date,
  progress: String,
  Comment:[
    {
      type:Schema.Types.ObjectId,
      ref:"Comment"
    }
  ]
});

const Project = mongoose.model("Project", newProject);
export default Project;
