import React from "react";
import { useGlobalContext } from "../context";

const SongSelected = () => {
  const {
    selectedSong,
    setSelectedSong,
    setsearchTracks,
    setPlaylistCreated,
    getAlbumTracks,
  } = useGlobalContext();
  const handleNo = () => {
    setSelectedSong();
  };
  const handleYes = () => {
    getAlbumTracks();
    setPlaylistCreated(true);
  };
  return (
    <div id="selected-song-cont">
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
      <div id="song-selected">
        <p id="question">Is this the right song?</p>
        <img
          src={selectedSong[2]}
          alt={selectedSong[0] + " by " + selectedSong[1]}
        />
        <h3 id="title">{selectedSong[0]}</h3>
        <p id="artist">{selectedSong[1]}</p>

        <button id="no-but" onClick={handleNo}>
          No, go back.
        </button>
        <br />
        <button id="yes-but" onClick={handleYes}>
          Yes, make my playlist!
        </button>
      </div>
    </div>
  );
};

export default SongSelected;
