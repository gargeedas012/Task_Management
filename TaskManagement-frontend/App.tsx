import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./src/pages/Login";
import { Dashboard } from "./src/pages/Dashboard";
import { ProtectedRoute, PublicRoute } from "./src/components/ProtectedRoute";
import Register from "./src/pages/Register";
import { Toaster } from "@fluentui/react-components";
import ProjectForm from "./src/pages/ProjectForm";
import ProjectList from "./src/pages/ProjectList";
import ProjectBoard from "./src/pages/ProjectBoard";
import { Layout } from "./src/pages/Layout";
import { Settings } from "./src/pages/Settings";
import "./css/global.css";
import TaskList from "./src/pages/TaskList";

function App() {
  return (
    <>
    <Toaster toasterId="app-toaster" position="top" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
           <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route element={<Layout/>}>
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/projects" element={<ProtectedRoute><ProjectForm/></ProtectedRoute>}/>
                <Route path="/viewproject" element={<ProtectedRoute><ProjectList/></ProtectedRoute>}/>
                <Route path="/projectboard" element={<ProtectedRoute><ProjectBoard/></ProtectedRoute>}/>
                <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
                <Route path="/tasks" element={<ProtectedRoute><TaskList/></ProtectedRoute>}/>
            </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
