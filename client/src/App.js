import React from "react";
import Form from "./component/Form";
import Table from "./component/Table";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1 className="heading">🎂 Birthday Reminder</h1>
      <p className="subheading">Automatically send birthday emails to your friends</p>

      <div className="form-area">
        <Form />
      </div>

      <div className="table-area">
        <Table />
      </div>
    </div>
  );
}

export default App;
