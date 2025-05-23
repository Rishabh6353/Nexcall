import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* <Route path="/home" element ="/"></Route> */}

          <Route path="/" element={<LandingPage />}></Route>

          <Route path="/auth" element={<Authentication />}></Route>


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
