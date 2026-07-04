import { useState } from "react";
import api from "../api/axios";

function EditTaskModal({ task, closeModal, refreshTasks }) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate?.slice(0, 10),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateTask = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/tasks/${task._id}`, formData);
      refreshTasks();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Task update failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Task</h2>

        <form onSubmit={updateTask}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

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
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;