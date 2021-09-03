import React, { useState, useEffect } from 'react'
import ControlButton from './components/ControlButton'
import Header from './components/Header'
import Albums from './components/Albums'
import styled from 'styled-components'
import SpotifyWebApi from 'spotify-web-api-js'
const spotifyApi = new SpotifyWebApi()

const loadAlbums = () => {
  const storedAlbums = window.localStorage.getItem('kidplayer.albums')
  if (storedAlbums) {
    let albums = JSON.parse(storedAlbums)
    if (!albums.all.find((a) => !('query' in a) || !('album' in a))) {
      return albums
    }
  }
  return { playing: {}, all: [] }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [usedToken, setUsedToken] = useState({})
  const [nowPlaying, setNowPlaying] = useState({})
  const [playing, setPlaying] = useState(false)
  const [page, setPage] = useState('player')
  const [albums, setAlbums] = useState(loadAlbums())

  const getNowPlaying = () => {
    setTimeout(() => {
      spotifyApi
        .getMyCurrentPlaybackState()
        .then((response) => {
          // console.log('getnowplayingresponse :', response)
          if (!response || !response.item) {
            // console.log('no response')
            return
          }
          setPlaying(response.is_playing)
          setNowPlaying({
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
          })
        })
        .catch((e) => {
          console.log('error at getnowplaying', e)
          setLoggedIn(false)
        })
    }, 500)
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const access_token = params.get('access_token')
    if (!loggedIn && access_token === usedToken) {
      return
    }
    if (access_token && !loggedIn) {
      spotifyApi.setAccessToken(access_token)
      setUsedToken(access_token)
      setLoggedIn(true)
      getNowPlaying()
    }
  }, [loggedIn, usedToken])

  const setPlayingAlbum = (item) => {
    if (item.album) {
      spotifyApi
        .play({ context_uri: 'spotify:album:' + item.album.id })
        .then((playResponse) => {
          saveAlbums({ playing: item, all: albums.all })
          // console.log('playResponse :', playResponse)
          getNowPlaying()
        })
        .catch((e) => handleError(e))
    }
  }
  const searchFirstMatchingAlbum = (query) => {
    return spotifyApi.searchAlbums(query).then((response) => {
      //console.log(response)
      if (!response || !response.albums || !response.albums.items) {
        throw `Virhe tehtäessä Spotify-hakua: ${query}`
      }
      const lpAlbum = response.albums.items.find((a) => a.album_type !== 'single')
      if (!lpAlbum) {
        throw `Ei löydy LP-albumia Spotify-haulla: ${query}`
      }
      return lpAlbum
    })
  }
  const saveAlbums = (albums) => {
    window.localStorage.setItem('kidplayer.albums', JSON.stringify(albums))
    setAlbums(albums)
  }
  const handleError = (e) => {
    if (!e.response) {
      console.log(e)
      return
    }
    const noDevice = e.response.includes('NO_ACTIVE_DEVICE')
    console.log('handleError', e, noDevice)
    if (noDevice) {
      spotifyApi.getMyDevices().then((response) => {
        console.log('devices', response)
        spotifyApi.play({ device_id: response.devices[0].id })
      })
    }
  }
  const playPause = () => {
    if (playing) {
      spotifyApi
        .pause()
        .then(() => setPlaying(false))
        .catch((e) => {
          setPlaying(false)
          handleError(e)
        })
    } else {
      spotifyApi
        .play()
        .then(() => setPlaying(true))
        .catch((e) => {
          setPlaying(true)
          handleError(e)
        })
    }
  }

  const shuffle = () => {
    spotifyApi
      .setShuffle(true)
      .then(() => spotifyApi.skipToNext())
      .then(() => getNowPlaying())
      .then(() => spotifyApi.setShuffle(false))
      .catch((e) => handleError(e))
  }
  const previous = () => {
    spotifyApi
      .skipToPrevious()
      .then(() => getNowPlaying())
      .catch((e) => handleError(e))
  }
  const next = () => {
    spotifyApi
      .skipToNext()
      .then(() => getNowPlaying())
      .catch((e) => handleError(e))
  }
  let loginUrl = 'https://hyöty.net/kidplayer-auth/login'
  if (process.env.NODE_ENV !== 'production') {
    loginUrl = 'http://localhost:8888/login'
  }
  return (
    <Screen>
      <Header loginUrl={loginUrl} page={page} setPage={setPage} loggedIn={loggedIn} nowPlaying={nowPlaying} />
      <Content>
        {page === 'player' && (
          <Player>
            <ControlButton text='E' svg='previous' action={previous} color='#EACECE' />
            <ControlButton text='N' action={playPause} playing={playing} color='#FFFFFF' />
            <ControlButton text='S' svg='next' action={next} color='#EACECE' />
            <ControlButton text='?' action={shuffle} color='#FFFFFF' />
          </Player>
        )}
        {page === 'albums' && (
          <Albums
            albums={albums}
            setPage={setPage}
            setPlayingAlbum={setPlayingAlbum}
            searchFirstMatchingAlbum={searchFirstMatchingAlbum}
            saveAlbums={saveAlbums}
          />
        )}
      </Content>
      <footer />
    </Screen>
  )
}

const Player = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const Content = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`
const Screen = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  height: 100vh;
`

export default App
