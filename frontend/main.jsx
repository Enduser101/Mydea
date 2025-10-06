
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const API_URL = "http://localhost:8765";

function App() {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/ideas`).then(res => setIdeas(res.data));
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.destination.droppableId === "trash") {
      const idea = ideas[result.source.index];
      axios.patch(`${API_URL}/ideas/${idea.id}`, { archived: true })
        .then(() => setIdeas(ideas.filter(i => i.id !== idea.id)));
    } else {
      const reordered = Array.from(ideas);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      setIdeas(reordered);
      reordered.forEach((idea, idx) => {
        axios.patch(`${API_URL}/ideas/${idea.id}`, { position: idx });
      });
    }
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: "70%", background: "#fdf6e3", padding: "1rem" }}>
              {ideas.map((idea, index) => (
                <Draggable key={idea.id} draggableId={idea.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                      style={{ padding: "1rem", marginBottom: "0.5rem", background: "#fff59d", borderRadius: "8px", ...provided.draggableProps.style }}>
                      <h3>{idea.title}</h3>
                      <p>{idea.description}</p>
                      <small>{idea.tags}</small>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="trash">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}
              style={{ width: "25%", minHeight: "400px", background: "#ef9a9a", padding: "1rem", borderRadius: "8px" }}>
              <h3>🗑️ Trash</h3>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
