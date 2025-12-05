import React, { useState } from "react";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const openEditModal = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
    });
  };

  const handleSave = () => {
    onUpdate(editingTask._id, editForm);
    setEditingTask(null);
  };

  if (!tasks.length) {
    return <p className="empty-list">No tasks yet. Try adding one or using voice input.</p>;
  }

  return (
    <>
      <div className="task-list-container">
        <div className="task-list-header">
          <span>Task</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Due</span>
          <span>Actions</span>
        </div>

        {tasks.map((task) => (
          <div key={task._id} className="task-row">
            {/* Title + description */}
            <div className="task-main">
              <h6>{task.title}</h6>
              {/* {task.description && <p className="desc">{task.description}</p>} */}
            </div>

            <span className="status-badge">{task.status}</span>

            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>

            <span className="due">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
            </span>

            <div className="actions">
              <button className="icon-btn" onClick={() => openEditModal(task)}>
                ✏️
              </button>
              <button className="icon-btn delete" onClick={() => onDelete(task._id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ======================= EDIT MODAL ======================= */}
      {editingTask && (
        <div className="modal-backdrop">
          <div className="modal edit-modal">
            <h4>Edit Task</h4>

            <label>
              Title
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </label>

            <label>
              Description
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </label>

            <div className="row small-gap">
              <label>
                Status
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </label>

              <label>
                Priority
                <select
                  value={editForm.priority}
                  onChange={(e) =>
                    setEditForm({ ...editForm, priority: e.target.value })
                  }
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>

              <label>
                Due Date
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dueDate: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="primary" onClick={handleSave}>
                Save
              </button>
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
