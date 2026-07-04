import { useState } from "react";
import api from "../api/axios";

function AddTaskModal({ closeModal, refreshTasks }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addTask = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", formData);
      refreshTasks();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Task add failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New Task</h2>

        <form onSubmit={addTask}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;