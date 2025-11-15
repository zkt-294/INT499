import React, { useState, useEffect } from "react";
import "./StreamList.css";

function StreamList() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("movie");
  const [status, setStatus] = useState("need-to-watch");

  // Loads saved items
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("streamlist-items");
    return saved ? JSON.parse(saved) : [];
  });

  const [editId, setEditId] = useState(null);

  // Save items on updates also
  useEffect(() => {
    localStorage.setItem("streamlist-items", JSON.stringify(items));
  }, [items]);

  const handleAdd = () => {
    if (title.trim() === "") return;

    if (editId !== null) {
      setItems(
        items.map((item) =>
          item.id === editId
            ? { ...item, title, type, status }
            : item
        )
      );
      setEditId(null);
    } else {
      const newItem = {
        id: Date.now(),
        title,
        type,
        status,
      };
      setItems([...items, newItem]);
    }

    setTitle("");
    setType("movie");
    setStatus("need-to-watch");
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setType(item.type);
    setStatus(item.status);
    setEditId(item.id);
  };

  return (
    <div className="streamlist-container">
      <h2>Your StreamList</h2>

      <div className="input-section">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add something you silly goose!"
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="movie">Movie</option>
          <option value="show">Show</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="need-to-watch">Need to Watch</option>
          <option value="already-watched">Already Watched</option>
        </select>

        <button onClick={handleAdd}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="item-list">
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> — {item.type} — {item.status}

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleEdit(item)}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;