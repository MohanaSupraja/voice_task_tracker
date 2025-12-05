import React, { useState } from "react";

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.substring(0, 10) : "",
  });

  const handleSave = async () => {
    await onUpdate(task._id, form);
    setEditing(false);
  };

  const priorityClass = (task.priority || "Medium").toLowerCase();
const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className={`task-card ${priorityClass}`}
      style={{ userSelect: "none" }}
        onClick={(e) => e.stopPropagation()}

      onMouseDown={(e) => {
        if (editing) e.stopPropagation();
      }}
    >
      {editing ? (
       <div className="task-edit">
  <div className="form-group">
    <label>Title</label>
    <input
      className="input"
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      placeholder="Enter task title"
    />
  </div>

  <div className="form-group">
    <label>Description</label>
    <textarea
      className="textarea"
      value={form.description}
      onChange={(e) => setForm({ ...form, description: e.target.value })}
      placeholder="Add an optional description"
    />
  </div>

  <div className="edit-row">
    <div className="form-group small">
      <label>Status</label>
      <select
        className="input"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
    </div>

    <div className="form-group small">
      <label>Priority</label>
      <select
        className="input"
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>

    <div className="form-group small">
      <label>Due Date</label>
      <input
        type="date"
        className="input"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />
    </div>
  </div>

  <div className="actions-row">
    <button className="btn save-btn" onClick={handleSave}>Save</button>
    <button className="btn cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
  </div>
</div>

      ) : (
<>
  <div className="task-header">
    <h4 className="task-title">{task.title}</h4>
    <div className="task-actions">
      <button 
        className="" 
        onClick={() => setEditing(true)}
        title="Edit"
      >✏️</button>
      <button 
        className="" 
        onClick={() => onDelete(task._id)}
        title="Delete"
      >🗑️</button>
    </div>
  </div>
  

  
  <div className="task-tags">
    <span className={`task-tag tag-priority ${priorityClass}`}>
      {task.priority}
    </span>
    {/* <span className="task-tag tag-status">{task.status}</span> */}
    {task.dueDate && (
      <span className={`task-tag tag-due ${isOverdue ? 'overdue' : ''}`}>
        {new Date(task.dueDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>
    )}
  </div>
</>


      )}
    </div>
  );
};

export default TaskCard;
