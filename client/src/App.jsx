import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./assets/css/style.css";
import Home from "./routes/Home";
import Register from "./routes/Register";
import Login from "./routes/Login";
import Unsubscribe from "./routes/Unsubscribe";
import Error from "./routes/404";

const App = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/unsubscribe"
            element={
              <ProtectedRoute>
                <Unsubscribe />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

export default App;
