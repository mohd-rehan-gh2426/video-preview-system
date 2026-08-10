import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Navbar from "./components/Navbar/Navbar";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
    <Navbar/>
    <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </>
  );
};

export default App;
