import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Videos from "./pages/Videos/Videos";
import Watch from "./pages/Watch/Watch";
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
        <Route path="/videos" element={<Videos />} />
        <Route path="/videos/:videoId" element={<Watch />} />
      </Routes>
    </>
  );
};

export default App;
