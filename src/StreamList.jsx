import React, { useState } from "react";
import "./StreamList.css"; 

function StreamList() {
  const [inputValue, setInputValue] = useState(""); // store input
  const [items, setItems] = useState([]); 

  const handleAdd = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue]); // add to list
      setInputValue(""); // clear input
    }
  };

  return (
    <div className="streamlist-container">
      <h2>Your StreamList</h2>
      
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add something you silly goose!"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul className="item-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default StreamList;