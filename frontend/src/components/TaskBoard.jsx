import React from "react";
import TaskCard from "./TaskCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";

const portal = document.getElementById("drag-portal");

const columns = ["To Do", "In Progress", "Done"];

const TaskBoard = ({ tasks, onUpdate, onDelete }) => {
  const grouped = {
    "To Do": tasks.filter((t) => t.status === "To Do"),
    "In Progress": tasks.filter((t) => t.status === "In Progress"),
    "Done": tasks.filter((t) => t.status === "Done"),
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    onUpdate(draggableId, { status: destination.droppableId });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="board">
        {columns.map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div
                className="column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div className="column-header">
                  <h3>{col}</h3>
                  <span className="pill">{grouped[col].length}</span>
                </div>

                {grouped[col].map((task, index) => (
                  <Draggable key={task._id} draggableId={task._id} index={index}>
                    {(provided, snapshot) => {
                      const card = (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task-drag ${snapshot.isDragging ? "dragging" : ""}`}
                          style={provided.draggableProps.style}
                        >
                          <TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} />
                        </div>
                      );

                      return snapshot.isDragging ? createPortal(card, portal) : card;
                    }}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;