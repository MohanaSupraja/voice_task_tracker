import React, { useState } from "react";

const defaultForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
};

const TaskForm = ({ onSubmit }) => {
  const [form, setForm] = useState(defaultForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }
    await onSubmit(form);
    setForm(defaultForm);
  };

  return (
    <form className="task-form enhanced-taskform" onSubmit={handleSubmit}>
      <h3 className="form-heading">Create New Task</h3>

      {/* Title + Date */}
      <div className="row">
        <div className="form-field">
          <label>Task Title</label>
          <input
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="form-field">
          <label>Due Date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-field">
        <label>Description</label>
        <textarea
          placeholder="Optional description..."
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {/* Status + Priority */}
     <div className="row">
  
  {/* LEFT SIDE - DROPDOWNS */}
  <div className="row-left">
    <div className="form-field small">
      <label>Status</label>
      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>

    <div className="form-field small">
      <label>Priority</label>
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  </div>

  {/* RIGHT SIDE - BUTTON */}
  <button type="submit" className="primary-btn add-btn">
    + Add Task
  </button>
</div>

    </form>
  );
};

export default TaskForm;
