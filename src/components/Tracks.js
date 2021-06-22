import React from "react";
import { useGlobalContext } from "../context";
import Grid from "@material-ui/core/Grid";

const Tracks = () => {
  const {
    searchTracks,
    setSelectedSong,
    getUserId,
    getLikedTracks,
    getTopTracks,
    getArtistTop,
    getAlbum,
  } = useGlobalContext();

  return (
    <div>
      {searchTracks.length === 0 && (
        <p id="no-results">Sorry, we can't find that song.</p>
      )}
      <Grid container spacing={5} id="grid">
        {searchTracks.map((item, i) => {
          let artists = item.artists;
          let artistName = [];
          let artistIds = [];
          let image = item.album.images[1].url;
          artists.forEach((artist) => {
            artistName.push(artist.name);
            artistIds.push(artist.id);
          });
          let artistNameString = artistName.join(", ");
          return (
            <Grid
              item
              xs="auto"
              sm={6}
              md={4}
              lg={3}
              key={i}
              className="grid-item"
              onClick={(e) => {
                setSelectedSong([
                  item.name,
                  artistNameString,
                  image,
                  item.uri,
                  artistIds,
                ]);
                getUserId();
                getLikedTracks();
                getTopTracks();
                getArtistTop(artistIds, artistName, item.name);
                getAlbum(artistIds, artistName, item.name);
              }}
            >
              <img src={image} alt={item.name + " " + artistName} />
              <h3>{item.name}</h3>
              <p>{artistNameString}</p>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Tracks;
