function ViewTaskModal({ task, closeModal }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box view-modal">
        <h2>{task.title}</h2>

        <p>
          <strong>Description:</strong>
          <br />
          {task.description || "No description"}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>

        <p>
          <strong>Added Date:</strong> {formatDate(task.createdAt)}
        </p>

        <p>
          <strong>Due Date:</strong> {formatDate(task.dueDate)}
        </p>

        <button className="save-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

export default ViewTaskModal;