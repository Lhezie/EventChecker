// App.jsx
import React, { useEffect, useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3020/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="app-wrapper">
      <header className="sticky-header">
        <h1>🎂 Birthday Reminder</h1>
        <p>Automatically send birthday emails to your friends</p>
      </header>

      <main className="scroll-content">
        <div className="form-area">
          <Form onUserAdded={fetchUsers} />
        </div>
        <div className="table-area">
          <Table users={users} />
        </div>
      </main>
    </div>
  );
}

export default App;
