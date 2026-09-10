import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./src/pages/Auth/Login";
import { Dashboard } from "./src/pages/Dashboard/Dashboard";
import { ProtectedRoute, PublicRoute } from "./src/components/ProtectedRoute";
import Register from "./src/pages/Auth/Register";
import { Toaster } from "@fluentui/react-components";
import ProjectList from "./src/pages/Project/ProjectList";
import { Layout } from "./src/pages/Common/Layout";
import { Settings } from "./src/pages/Settings/Settings";
import "./css/global.css";
import TaskList from "./src/pages/Task/TaskList";
import TaskForm from "./src/pages/Task/TaskForm";
import {CalendarPage} from "./src/pages/Task/CalendarPage";
import TaskShow from "./src/pages/Task/Task";

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
                <Route path="/projects" element={<ProtectedRoute><ProjectList/></ProtectedRoute>}/>
                <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
                <Route path="/tasks" element={<ProtectedRoute><TaskList/></ProtectedRoute>}/>
                <Route path="/tasks/new" element={<ProtectedRoute><TaskForm/></ProtectedRoute>}/>
                <Route path="/tasks/Edit" element={<ProtectedRoute><TaskForm/></ProtectedRoute>}/>
                <Route path="/calender" element={<ProtectedRoute><CalendarPage/></ProtectedRoute>}/>
                <Route path="/viewtask" element={<ProtectedRoute><TaskShow/></ProtectedRoute>}/>
            </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
