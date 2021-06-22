import React, { useContext, useEffect, useState } from "react";
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [likedTracks, setLikedTracks] = useState({});
  const [topTracks, setTopTracks] = useState({});
  const [userId, setUserId] = useState();
  const [searchTracks, setsearchTracks] = useState();
  const [selectedSong, setSelectedSong] = useState();
  const [artistTopTracks, setArtistTopTracks] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [albumTracks, setAlbumTracks] = useState([]);

  useEffect(() => {
    document.title = "Streamlist";
  }, []);

  // Stores access token, expiry, and token type in session storage.
  useEffect(() => {
    if (window.location.hash) {
      setIsLoggedIn(true);
      const { access_token, expires_in, token_type } = getAuthToken(
        window.location.hash
      );
      sessionStorage.clear();
      sessionStorage.setItem("accessToken", access_token);
      sessionStorage.setItem("expiresIn", expires_in);
      sessionStorage.setItem("tokenType", token_type);
    }
  }, []);

  useEffect(() => {
    if (playlistCreated && albumTracks !== []) {
      createPlaylist();
    }
  }, [albumTracks]);

  // Manipulates window url to obtain access token, expiry, and token type.
  const getAuthToken = (hash) => {
    const afterHash = hash.substring(1);
    const splitHash = afterHash.split("&");
    const newParams = {};
    splitHash.forEach((item) => {
      let splitItem = item.split("=");
      let key = splitItem[0];
      let value = splitItem[1];
      newParams[key] = value;
    });
    return newParams;
  };

  // Gets user's Spotify ID.
  const getUserId = () => {
    let url = "https://api.spotify.com/v1/me/";
    let accessToken = sessionStorage.getItem("accessToken");
    let auth = "Bearer " + accessToken;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsLoggedIn(false);
            window.location.assign("/");
          } else {
            setUserId(res.id);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Gets user's liked tracks on Spotify.
  const getLikedTracks = () => {
    let url = "https://api.spotify.com/v1/me/tracks?limit=50";
    let accessToken = sessionStorage.getItem("accessToken");
    let auth = "Bearer " + accessToken;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsLoggedIn(false);
          } else {
            setLikedTracks(res.items);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Gets user's top tracks on Spotify.
  const getTopTracks = () => {
    let url = "https://api.spotify.com/v1/me/top/tracks?limit=50";
    let accessToken = sessionStorage.getItem("accessToken");
    let auth = "Bearer " + accessToken;
    try {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsLoggedIn(false);
          } else {
            setTopTracks(res.items);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Creates playlist for user.
  const createPlaylist = () => {
    if (userId) {
      let url = "https://api.spotify.com/v1/users/" + userId + "/playlists";
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      let body =
        '{"name":"Your Streamlist","description":"Stream from here!","public":false}';
      try {
        fetch(url, {
          method: "POST",
          body: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setIsLoggedIn(false);
            } else {
              setPlaylistUrl(res.external_urls.spotify);
              addToPlaylist(res.id);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Adds songs to playlist that was created in createPlaylist().
  const addToPlaylist = (playlistId) => {
    let streamSongUri = selectedSong[3];
    let otherTrackUris = getOtherTracks();
    let topArtistUris = refineTracks(artistTopTracks, streamSongUri);
    let albumTrackUris = refineTracks(albumTracks, streamSongUri);
    let uris = createUris(
      streamSongUri,
      otherTrackUris,
      topArtistUris,
      albumTrackUris
    );
    if (uris) {
      let url =
        "https://api.spotify.com/v1/playlists/" +
        playlistId +
        "/tracks?uris=" +
        uris;
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      try {
        fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setIsLoggedIn(false);
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const createUris = (song, other, top, album) => {
    let uriList = [
      song,
      top[0],
      album[0],
      album[1],
      song,
      album[2],
      top[1],
      other[0],
      song,
      top[2],
      album[3],
      top[3],
      song,
      top[4],
      top[5],
      other[1],
      song,
      album[4],
      album[5],
      top[6],
      song,
      album[6],
      other[2],
      top[7],
      song,
      album[7],
      album[8],
      top[8],
      song,
      top[9],
      top[10],
      other[3],
      song,
      album[9],
      top[11],
      song,
    ];
    return uriList.join(",");
  };

  const refineTracks = (tracks, streamSongUri) => {
    let uris = [];
    while (uris.length < 22) {
      let randomNum = Math.floor(Math.random() * tracks.length);
      if (!(streamSongUri === tracks[randomNum])) {
        uris.push(tracks[randomNum]);
      }
    }
    return uris;
  };

  // Gets tracks from user's liked tracks and top tracks that aren't by the artist of the selected song.
  const getOtherTracks = () => {
    let validLikedTracks = getValidTracks(likedTracks);
    let validTopTracks = getValidTracks(topTracks);
    let otherTracks = validLikedTracks.concat(validTopTracks);
    let otherUri = [];
    if (otherTracks.length !== 0) {
      for (let i = 0; i < 4; i++) {
        let randomNum = Math.floor(Math.random() * otherTracks.length);
        otherUri.push(otherTracks[randomNum].uri);
      }
    }
    return otherUri;
  };

  // Iterates through track list provided by getOtherTracks() function. s
  const getValidTracks = (trackList) => {
    let validTracks = [];
    let trackArtists = selectedSong[4];
    trackList.forEach((track) => {
      let artists = [];
      let artistInSelectedSong = false;
      if (track.track) {
        artists = track.track.artists;
      } else {
        artists = track.artists;
      }
      for (let i = 0; i < artists.length; i++) {
        let artist = artists[i];
        if (trackArtists.includes(artist.id)) {
          artistInSelectedSong = true;
          break;
        }
      }
      if (!artistInSelectedSong) {
        if (track.track) {
          validTracks.push(track.track);
        } else {
          validTracks.push(track);
        }
      }
    });
    return validTracks;
  };

  // Get artist top tracks.
  const getArtistTop = (artistIds, artistNames, songName) => {
    let uris = [];
    for (let i = 0; i < artistIds.length; i++) {
      let artistId = artistIds[i];
      let artistName = artistNames[i];
      if (songName.includes(artistName) && songName.includes("feat")) {
        continue;
      }
      let url =
        "https://api.spotify.com/v1/artists/" +
        artistId +
        "/top-tracks?market=US";
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      try {
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setIsLoggedIn(false);
            } else {
              for (let j = 0; j < res.tracks.length; j++) {
                let track = res.tracks[j];
                uris.push(track.uri);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    setArtistTopTracks(uris);
  };

  // Gets albums of given artists.
  const getAlbum = (artistIds, artistNames, songName) => {
    let albumIds = [];
    for (let i = 0; i < artistIds.length; i++) {
      let limit = 3;
      let albumNames = [];
      let artistId = artistIds[i];
      let artistName = artistNames[i];
      if (songName.includes(artistName) && songName.includes("feat")) {
        limit = 1;
      }
      let url = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      try {
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setIsLoggedIn(false);
            } else {
              let albums = res.items;
              for (let j = 0; j < albums.length; j++) {
                if (albumNames.length === limit) {
                  break;
                }
                let album = albums[j];
                let albumName = album.name;
                let albumId = album.id;
                while (/.+\(/.test(albumName)) {
                  let index = albumName.lastIndexOf("(");
                  albumName = albumName.slice(0, index);
                }
                while (/.+-/.test(albumName)) {
                  let index = albumName.lastIndexOf("-");
                  albumName = albumName.slice(0, index);
                }
                while (/.+\[/.test(albumName)) {
                  let index = albumName.lastIndexOf("[");
                  albumName = albumName.slice(0, index);
                }
                if (albumNames.length === 0) {
                  albumNames.push(albumName);
                  albumIds.push(albumId);
                } else {
                  let albumNameInList = false;
                  for (let k = 0; k < albumNames.length; k++) {
                    let existingName = albumNames[k];
                    if (
                      albumName.includes(existingName) ||
                      existingName.includes(albumName)
                    ) {
                      albumNameInList = true;
                    }
                  }
                  if (!albumNameInList) {
                    albumNames.push(albumName);
                    albumIds.push(albumId);
                  }
                }
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    setAlbumList(albumIds);
  };

  // Get tracks from albums.
  const getAlbumTracks = () => {
    let trackList = [];
    for (let i = 0; i < albumList.length; i++) {
      let albumId = albumList[i];
      let url = "https://api.spotify.com/v1/albums/" + albumId + "/tracks";
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      try {
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: auth,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.error) {
              setIsLoggedIn(false);
            } else {
              let albums = res.items;
              for (let i = 0; i < albums.length; i++) {
                let album = albums[i];
                trackList.push(album.uri);
              }
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
    setAlbumTracks(trackList);
  };

  // Gets tracks that matches search query.
  const getSearch = (searchVal) => {
    if (searchVal) {
      let q = "";
      for (let i = 0; i < searchVal.length; i++) {
        let character = searchVal[i];
        if (/[`~!@#$%^&*()-+={}[\]|\\:;"'<,>.?/_ ]/.test(character)) {
          q = q + "%" + searchVal.charCodeAt(i).toString(16);
        } else {
          q += character;
        }
      }
      let url =
        "https://api.spotify.com/v1/search?q=" +
        '"' +
        q +
        '"' +
        "&type=track&limit=24";
      let accessToken = sessionStorage.getItem("accessToken");
      let auth = "Bearer " + accessToken;
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: auth,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            setIsLoggedIn(false);
          } else {
            setsearchTracks(res.tracks.items);
          }
        });
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        likedTracks,
        getLikedTracks,
        getTopTracks,
        getUserId,
        getSearch,
        getArtistTop,
        searchTracks,
        setsearchTracks,
        setSelectedSong,
        selectedSong,
        playlistCreated,
        setPlaylistCreated,
        playlistUrl,
        getAlbumTracks,
        getAlbum,
        createPlaylist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
