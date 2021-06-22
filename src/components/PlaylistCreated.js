import React from "react";
import { useGlobalContext } from "../context";

const PlaylistCreated = () => {
  const { setSelectedSong, setsearchTracks, setPlaylistCreated, playlistUrl } =
    useGlobalContext();
  return (
    <div id="playlist-create-cont">
      <h1
        className="title"
        onClick={() => {
          setsearchTracks();
          setSelectedSong();
          setPlaylistCreated(false);
        }}
      >
        Streamlist
      </h1>
      <div id="playlist-created">
        <h3>Your playlist has been created!</h3>
        <a href={playlistUrl} id="see-pl" target="_blank" rel="noreferrer">
          See playlist
        </a>
        <button
          onClick={() => {
            setsearchTracks();
            setSelectedSong();
            setPlaylistCreated(false);
          }}
          id="make"
        >
          Make another playlist
        </button>
      </div>
    </div>
  );
};

export default PlaylistCreated;
