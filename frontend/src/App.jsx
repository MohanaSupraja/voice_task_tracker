import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";

import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./store/taskSlice";

import { parseVoiceText } from "./store/parseSlice";

import TaskBoard from "./components/TaskBoard";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import VoiceInput from "./components/VoiceInput";
import ReviewModal from "./components/ReviewModal";

import useDebounce from "./hooks/useDebounce";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);

  // Redux State
  const { items: tasks, loading } = useSelector((state) => state.tasks);
  const parsedResult = useSelector((state) => state.parse.parsed);

  // UI State
  const [view, setView] = useState("board");
  const [filters, setFilters] = useState({ status: "", priority: "", q: "" });
  const [preview, setPreview] = useState(null);

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 400);

  // Fetch tasks only when debounce completes
  useEffect(() => {
    dispatch(fetchTasks(debouncedFilters));
  }, [dispatch, debouncedFilters]);

  // ---- Create Task ----
  const handleCreate = async (payload) => {
    setCreating(true);
    const result = await dispatch(createTask(payload));
    setCreating(false);
    setPreview(null);

    dispatch(fetchTasks(debouncedFilters));

    if (result.meta.requestStatus !== "fulfilled") {
      alert("Failed to create task.");
    }
  };

  // ---- Update Task ----
  const handleUpdate = async (id, updates) => {
    await dispatch(updateTask({ id, updates }));
    dispatch(fetchTasks(debouncedFilters));
  };

  // ---- Delete Task ----
  const handleDelete = async (id) => {
    if (window.confirm("Delete this task?")) {
      await dispatch(deleteTask(id));
      dispatch(fetchTasks(debouncedFilters));
    }
  };

  // ---- Voice Input ----
  const handleVoiceParsed = (transcript) => {
    dispatch(parseVoiceText(transcript));
  };

  // Open preview modal when LLM data arrives
  useEffect(() => {
    if (parsedResult) setPreview(parsedResult);
  }, [parsedResult]);

  return (
    <div className="app">
      {/* Loading screen */}
      {creating && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Creating task & sending email...</p>
        </div>
      )}

      {/* ---- Header ---- */}
      <ErrorBoundary>
        <header className="app-header fixed-header">
          <div className="header-content">
            <h1>Task Board</h1>
            <p className="subtitle">Manage tasks like a pro — talk or type.</p>
          </div>
        </header>
      </ErrorBoundary>

      {/* ---- Toolbar ---- */}
      <ErrorBoundary>
        <div className="toolbar toolbar-sticky">
          <div className="toolbar-left">
            <button
              className={view === "board" ? "active" : ""}
              onClick={() => setView("board")}
            >
              Board View
            </button>

            <button
              className={view === "list" ? "active" : ""}
              onClick={() => setView("list")}
            >
              List View
            </button>
          </div>

          <div className="toolbar-center">
            <input
              type="text"
              placeholder="🔎︎ Search tasks..."
              value={filters.q}
              onChange={(e) =>
                setFilters((f) => ({ ...f, q: e.target.value }))
              }
            />

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) =>
                setFilters((f) => ({ ...f, priority: e.target.value }))
              }
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="toolbar-right">
            <VoiceInput onTranscript={handleVoiceParsed} />
          </div>
        </div>
      </ErrorBoundary>

      {/* ---- Main Content ---- */}
      <ErrorBoundary>
        <main>
          {loading ? (
            <p>Loading...</p>
          ) : view === "board" ? (
            <TaskBoard
              tasks={tasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ) : (
            <TaskList
              tasks={tasks}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          )}
        </main>
      </ErrorBoundary>

      {/* ---- Manual Task Form ---- */}
      <ErrorBoundary>
        <section className="manual-section">
          <h3>Manual Task Creation</h3>
          <p className="section-subtitle">
            Prefer typing? Create or refine tasks manually here.
          </p>
          <TaskForm onSubmit={handleCreate} />
        </section>
      </ErrorBoundary>

      {/* ---- LLM Preview Modal ---- */}
      {preview && (
        <ErrorBoundary>
          <ReviewModal
            preview={preview}
            onClose={() => setPreview(null)}
            onConfirm={handleCreate}
          />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default App;
