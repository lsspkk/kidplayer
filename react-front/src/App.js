import React, { useState, useEffect } from 'react';
import Button from './components/Button'
import Header from './components/Header'
import Albums from './components/Albums'
import styled, { keyframes } from 'styled-components'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

const loadAlbums = () => {
  const albums = window.localStorage.getItem("kidplayer.albums")
  if( albums ) {
    return JSON.parse(albums)
  }
  return { playing: '', all : [ 'essen tessen teikar soi' ]}
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [usedToken, setUsedToken] = useState({})
  const [nowPlaying, setNowPlaying] = useState({})
  const [playing, setPlaying] = useState(false)
  const [page, setPage] = useState('player')
  const [albums, setAlbums] = useState(loadAlbums())
  const getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }
  const getNowPlaying = () => {
    setTimeout(() => {
      spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        console.log('getnowplayingresponse :', response);
        if( !response || !response.item) {
          console.log('no response')
          return
        }
        setPlaying(response.is_playing)
        setNowPlaying({ 
          name: response.item.name, 
          albumArt: response.item.album.images[0].url
        })}
        )
      .catch(e => {console.log("error at getnowplaying", e);setLoggedIn(false)})
    },500)
  }
  useEffect(() => {
    const params = getHashParams()
    if( !loggedIn && params.access_token === usedToken ) {
      return;
    }
    if ( params.access_token && !loggedIn) {
      spotifyApi.setAccessToken(params.access_token)
      setUsedToken(params.access_token)
      setLoggedIn(true)
      console.log("set logged in true")
      getNowPlaying()
    }
  })
  const setPlayingAlbum = (query) => {
    spotifyApi.searchAlbums(query)
    .then((response) => {
      console.log('response :', response);
      if( response )
        return response.albums.items.filter(a => a.album_type !== 'single').map(a => a.id)
      else
        return ''
    })
    .then((foundAlbums) => {
      console.log('filtered album search :', foundAlbums);
      if( foundAlbums && foundAlbums.length ) {
        saveAlbums({playing: query, all: albums.all})
        return spotifyApi.play({context_uri: 'spotify:album:'+foundAlbums[0]})
      }
      else
        return ''
    })
    .then((playResponse) => {
      console.log('playResponse :', playResponse); 
      getNowPlaying()
    })
    .catch(e => handleError(e))
  }
  const saveAlbums = (albums) => { 
    window.localStorage.setItem("kidplayer.albums", JSON.stringify(albums))
    setAlbums(albums)
  } 
  const handleError = (e) => {
    if( !e.response ) {
      console.log(e)
      return
    }
    const noDevice = e.response.includes('NO_ACTIVE_DEVICE')
    console.log("handleError", e, noDevice)
    if( noDevice) {
      spotifyApi.getMyDevices().then(response => {
        console.log("devices", response)
        spotifyApi.play({device_id: response.devices[0].id})
      })
    }
  }
  const playPause = () => {
    if( playing ) {
      spotifyApi.pause()
      .then(() => setPlaying(false))
      .catch(e =>{setPlaying(false);handleError(e)})
    } else {
      spotifyApi.play()
      .then(() => setPlaying(true))
      .catch(e =>{setPlaying(true);handleError(e)})
    }
  }

  const shuffle = () => {
    spotifyApi.setShuffle(true)
    .then(() =>spotifyApi.skipToNext())
    .then(() =>getNowPlaying())
    .then(() => spotifyApi.setShuffle(false))
    .catch(e =>handleError(e))
  }
  const previous = () => {
    spotifyApi.skipToPrevious()
    .then(() => getNowPlaying())
    .catch(e=>handleError(e))
  }
  const next = () => {
    spotifyApi.skipToNext()
    .then(() => getNowPlaying())
    .catch(e=>handleError(e))
  }
  let loginUrl = 'https://hyöty.net/kidplayer-auth/login'
  if(process.env !== 'production') {
    loginUrl = 'http://localhost:8888/login'
  }
  return (
    <Screen>
      <Header loginUrl={loginUrl} page={page} setPage={setPage} loggedIn={loggedIn} nowPlaying={nowPlaying} setPage={setPage} /> 
      <Content>
        { page === 'player' && 
          <Player>
            <Button text='E' svg='previous' action={previous} color='#EACECE'/>
            <Button text='N' action={playPause} playing={playing} color='#FFFFFF'/> 
            <Button text='S' svg='next' action={next} color='#EACECE'/>
            <Button text='?' action={shuffle} color='#FFFFFF'/>
          </Player>
        }
        { page === 'albums' && 
          <Albums albums={albums} setPage={setPage} setPlayingAlbum={setPlayingAlbum} saveAlbums={saveAlbums}/>
        }
        </Content>
      <footer>

      </footer>

    </Screen>
  )
}



const Player = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  height: 100%;
`

const Content = styled.div`
  height: 100%;
`
const Screen = styled.div`
  display: flex;
  justify-content: center;
  align-content:center;
  flex-direction: column;
  height: 100vh;
`

export default App;
