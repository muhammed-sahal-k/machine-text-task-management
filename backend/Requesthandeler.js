import bcrypt from "bcrypt";

import Task from "./Models/TaskModel.js";



import jwt from "jsonwebtoken";
import User from "./Models/UserModel.js";
export async function REGISTER(req, res) {
  try {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
      return res.status(400).json({
        message: "Name, email, password and confirm password are required"
      });
    }

    if (password !== cpassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please login"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
}

export async function LOGIN(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
}

export async function PROFILE(req, res) {
  return res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user
  });
}
























export async function ADD_TASK(req, res) {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({
        message: "Title and due date are required"
      });
    }

    if (status && !["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending or Completed"
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Pending",
      dueDate,
      userId: req.user._id
    });

    return res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Task creation failed",
      error: error.message
    });
  }
}

export async function GET_TASKS(req, res) {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      message: "Tasks fetched successfully",
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      message: "Tasks fetch failed",
      error: error.message
    });
  }
}

export async function GET_SINGLE_TASK(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    return res.status(200).json({
      message: "Task fetched successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Single task fetch failed",
      error: error.message
    });
  }
}

export async function UPDATE_TASK(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    if (status && !["Pending", "Completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Pending or Completed"
      });
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id
      },
      {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate && { dueDate })
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not authorized"
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    return res.status(500).json({
      message: "Task update failed",
      error: error.message
    });
  }
}

export async function DELETE_TASK(req, res) {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or not authorized"
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Task delete failed",
      error: error.message
    });
  }
}