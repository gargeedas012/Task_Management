import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./src/pages/Login";
import { Dashboard } from "./src/pages/Dashboard";
import { ProtectedRoute, PublicRoute } from "./src/components/ProtectedRoute";
import Register from "./src/pages/Register";
import TodoList from "./src/pages/TodoList";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/view" element={<ProtectedRoute><TodoList/></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
