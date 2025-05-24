import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import { AuthProvider } from "./contexts/AuthContext";
import VideoMeetComponent from "./pages/VideoMeet";

function App() {
  return (
    <>
      <BrowserRouter>

      <AuthProvider>
        <Routes>

          {/* <Route path="/home" element ="/"></Route> */}

          <Route path="/" element={<LandingPage />}></Route>

          <Route path="/auth" element={<Authentication />}></Route>


          <Route path ="/:url" element={<VideoMeetComponent/>}></Route>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
