import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import EditorPage from "./pages/Editor";
import { RequireAuth } from "./components/RequireAuth";
import { useEffect } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import BlogPage from "./pages/BlogPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import { AppContextProvider } from "./contexts/State";
import { useAppContext } from "./contexts/useAppContext";

function App() {
  return (  
    <AppContextProvider>
        <AppComponent />
    </AppContextProvider>
  );
}

function AppComponent() {
  const {user, login} = useAppContext()
  useEffect(() => {
    async function getUserSessionData() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ROUTE}/session`,
        {
          withCredentials: true,
        },
      );
      if (response.status === 200) {
        login(response.data)
      }
    }
    if (!user) {
      getUserSessionData();
    }
  }, [user, login]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
          path="/editor/:blogId"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/editor"
          element={
            <RequireAuth>
              <EditorPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="/blog/:blogId" element={<BlogPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
