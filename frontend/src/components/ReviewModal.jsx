import React, { useState } from "react";

const ReviewModal = ({ preview, onClose, onConfirm }) => {
  const [form, setForm] = useState({
    title: preview.title || "",
    description: "",
    status: preview.status || "To Do",
    priority: preview.priority || "Medium",
    dueDate: preview.dueDate ? preview.dueDate.substring(0, 10) : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    await onConfirm(form);
  };

  return (
    <div className="modal-backdrop enhanced">
      <div className="modal enhanced-modal">
        <div className="modal-header">
          <h2 className="modal-title">✨ Review Parsed Task</h2>
          <button className="icon-button close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-transcript">
          <strong>Transcript:</strong>
          <p>{preview.transcript}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title"
            />
          </label>

          <label className="modal-field">
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional description..."
            />
          </label>

          <div className="row modal-row">
            <label className="modal-field small">
              <span>Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </label>

            <label className="modal-field small">
              <span>Priority</span>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label className="modal-field small">
              <span>Due Date</span>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-btn">
              Create Task
            </button>
            <button type="button" className="secondary-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
