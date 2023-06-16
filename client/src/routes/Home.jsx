import React from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <SearchBar />
    </div>
  );
};

export default Home;
