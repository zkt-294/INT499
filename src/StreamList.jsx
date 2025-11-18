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

    // Check for duplicate title (case-insensitive)
    const normalizedTitle = title.trim().toLowerCase();
    const isDuplicate = items.some(
      (item) =>
        item.title.trim().toLowerCase() === normalizedTitle &&
        (editId === null || item.id !== editId)
    );
    if (isDuplicate) {
      alert("This title already exists in your list.");
      return;
    }

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
      <h2 id="streamlist-heading">Your StreamList</h2>

      <form
        className="input-section"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
        aria-labelledby="streamlist-heading"
      >
        <label htmlFor="streamlist-title">Title</label>
        <input
          id="streamlist-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add something you silly goose!"
          aria-required="true"
        />

        <label htmlFor="streamlist-type">Type</label>
        <select
          id="streamlist-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="movie">Movie</option>
          <option value="show">Show</option>
        </select>

        <label htmlFor="streamlist-status">Status</label>
        <select
          id="streamlist-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="need-to-watch">Need to Watch</option>
          <option value="already-watched">Already Watched</option>
        </select>

        <button type="submit" aria-label={editId ? "Update item" : "Add item"}>
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <ul className="item-list" aria-live="polite">
        {items.map((item) => (
          <li key={item.id}>
            <span>
              <strong>{item.title}</strong> — {item.type} — {item.status}
            </span>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleEdit(item)}
              aria-label={`Edit ${item.title}`}
            >
              Edit
            </button>

            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleDelete(item.id)}
              aria-label={`Delete ${item.title}`}
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