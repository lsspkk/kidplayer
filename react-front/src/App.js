import React, { useState, useEffect } from 'react';
import Button from './components/Button'
import Header from './components/Header'
import styled, { keyframes } from 'styled-components'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [usedToken, setUsedToken] = useState({})
  const [nowPlaying, setNowPlaying] = useState({})
  const [playing, setPlaying] = useState(false)
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
    spotifyApi.getMyCurrentPlaybackState()
    .then((response) => {
      console.log('getnowplayingresponse :', response);
      if( !response || !response.item) {
        console.log('no response')
        return
      }
      setPlaying(response.is_playing)
      setNowPlaying(
      { 
        name: response.item.name, 
        albumArt: response.item.album.images[0].url
      })}
      )
    .catch(e => {console.log("error at getnowplaying", e);setLoggedIn(false)})
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
  const setAlbum = (query) => {
    spotifyApi.searchAlbums(query)
    .then((response) => {
      console.log('response :', response);
      if( response )
        return response.albums.items.map(a => a.id)
      else
        return ''
    })
    .then((albums) => {
      console.log('albums :', albums);
      if( albums && albums.length )
        return spotifyApi.play({context_uri: 'spotify:album:'+albums[0]})
      else
        return ''
    })
    .then((playResponse) => {
      console.log('playResponse :', playResponse); 
      setTimeout(() =>getNowPlaying(),500)
    })
    .catch(e => handleError(e))
  }
  const handleError = (e) => {
    const noDevice = e.response.includes('NO_ACTIVE_DEVICE')
    console.log("handleError", e, noDevice)
    if( noDevice) {
      spotifyApi.getMyDevices().then(response => {
        console.log("devices", response)
        spotifyApi.play({device_id: response.devices[0].id})
      })
    }
    else {
      setLoggedIn(false);
    }
  }
  const playPause = () => {
    if( playing ) {
      spotifyApi.pause().then(setPlaying(false)).catch(e =>{setPlaying(false);handleError(e)})
    } else {
      spotifyApi.play().then(setPlaying(true)).catch(e =>{setPlaying(true);handleError(e)})
    }
  }

  return (
    <Screen>
      <Header loginUrl={KIDPLAYER_LOGIN_URL} loggedIn={loggedIn} nowPlaying={nowPlaying} setAlbum={setAlbum}/>
      <Content>
        <Button text='E' action={() => spotifyApi.skipToPrevious().catch(e=>handleError(e))} color='blue'/>
        <Button text='N' action={playPause} playing={playing} color='green'/> 
        <Button text='S' action={() => spotifyApi.skipToNext().catch(e=>handleError(e))} color='yellow'/>
        <Button text='?' action={() => {spotifyApi.setShuffle();spotifyApi.skipToNext().catch(e =>handleError(e))}} color='red'/>
      </Content>
      <footer>

      </footer>

    </Screen>
  )
}

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
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
