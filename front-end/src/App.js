import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./screens/Login";
import Register from "./screens/Register";
import Error from "./screens/Error";
import Dashboard from "./screens/Dashboard";
import AddGroup from "./screens/AddGroup";
import Chat from "./screens/chat";
import AuthRoute from "./components/AuthRoute" 

function App() {


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/signup" element={<Register />} />

          <Route
            path="/dashboard"
            element={<AuthRoute component={Dashboard} />}
          />
          <Route
            path="/group"
            element={<AuthRoute component={AddGroup} />}
          />
          <Route
            path="/chat/:groupId"
            element={<AuthRoute component={Chat} />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
