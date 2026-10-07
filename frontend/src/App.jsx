import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================
                    PUBLIC ROUTES
                ================================= */}

        <Route element={<PublicRoute />}>

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>


        {/* =================================
                    PROTECTED ROUTES
                ================================= */}

        <Route
          element={<ProtectedRoute />}
        >

          <Route
            element={<AppLayout />}
          >

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/jobs"
              element={<Jobs />}
            />

            <Route
              path="/applications"
              element={<Applications />}
            />

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>


        {/* =================================
                    404
                ================================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;