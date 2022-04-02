import { BrowserRouter, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Registration from "./pages/registration";
import Home from "./pages/home";
import React from "react";
import { routes } from "././shared/routes";
import { Reports } from "./pages/reports";
import { Locations } from "./pages/locations";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path={routes.root} element={<Home />} />
          <Route path={routes.auth} element={<Auth />} />
          <Route path={routes.registration} element={<Registration />} />
          <Route path={routes.reports} element={<Reports />} />
          <Route path={routes.locations} element={<Locations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
