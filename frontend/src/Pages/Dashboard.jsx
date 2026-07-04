import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "../api/axios";
import AddTaskModal from "../Components/AddTaskModal";
import EditTaskModal from "../Components/EditTaskModal";
import ViewTaskModal from "../Components/ViewTaskModal";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.tasks);
    } catch (error) {
      alert(error.response?.data?.message || "Tasks fetch failed");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const updateStatus = async (task, status) => {
    try {
      await api.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status,
        dueDate: task.dueDate,
      });

      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Task Management</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="task-card">
        <div className="task-top">
          <h2>My Tasks</h2>
          <button className="add-btn" onClick={() => setAddOpen(true)}>
            + Add Task
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Added Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-task">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description || "No description"}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task, e.target.value)}
                      className={task.status === "Completed" ? "completed" : "pending"}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td>{formatDate(task.createdAt)}</td>
                  <td>
                    <div className="actions">
                      <button className="view" onClick={() => setViewTask(task)}>
                        <FaEye />
                      </button>

                      <button className="edit" onClick={() => setEditTask(task)}>
                        <FaEdit />
                      </button>

                      <button className="delete" onClick={() => deleteTask(task._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <AddTaskModal
          closeModal={() => setAddOpen(false)}
          refreshTasks={fetchTasks}
        />
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          closeModal={() => setEditTask(null)}
          refreshTasks={fetchTasks}
        />
      )}

      {viewTask && (
        <ViewTaskModal
          task={viewTask}
          closeModal={() => setViewTask(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;