import React from "react";
import { useGlobalContext } from "../context.js";
import Tracks from "./Tracks";

const Dashboard = () => {
  const {
    searchTracks,
    setsearchTracks,
    setSelectedSong,
    getSearch,
    setPlaylistCreated,
  } = useGlobalContext();

  const handleInput = (e) => {
    if (e.key === "Enter") {
      setSelectedSong();
      getSearch(e.target.value);
      e.target.value = "";
    }
  };

  return (
    <div id="dashboard">
      <h1
        className="title"
        onClick={() => {
          setsearchTracks();
          setPlaylistCreated(false);
        }}
      >
        Streamlist
      </h1>
      <p id="input-label">What song do you want to stream?</p>
      <input type="search" onKeyUp={handleInput} />
      {searchTracks && <Tracks />}
    </div>
  );
};

export default Dashboard;
