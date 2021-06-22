import React from "react";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import { useGlobalContext } from "./context.js";
import SongSelected from "./components/SongSelected";
import PlaylistCreated from "./components/PlaylistCreated";

const App = () => {
  const { isLoggedIn, selectedSong, playlistCreated } = useGlobalContext();
  return (
    <div>
      {(playlistCreated && <PlaylistCreated />) ||
        (selectedSong && <SongSelected />) ||
        (!isLoggedIn ? <Login /> : <Dashboard />)}
    </div>
  );
};

export default App;
