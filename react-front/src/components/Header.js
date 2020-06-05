import React from 'react';
import styled, { keyframes } from 'styled-components'
import logo from '../logo.svg';
import useLongPress from './useLongPress'

export function Header(props) {
  console.log('Header', props)
  const myLongPress = useLongPress(() => props.setPage('albums'), 1000)
  return (
      <HeaderBar>
      <Title>
      <Logo src={logo} alt="logo" />
        <div>Kidplayer</div>
      </Title>
      <div>
        { (!props.loggedIn) &&
          <Icon >
            <a href={props.loginUrl}>Loggaa Spotifyyn</a>
          </Icon>
        }
        { props.loggedIn && props.page !== 'albums' &&
          <Icon {...myLongPress}>Albumit<br/><small>(Paina pitkään)</small></Icon>
        }
        { props.loggedIn && props.page === 'albums' &&
          <Icon onClick={() => props.setPage('player')}>Soitin<br/><small>(Takaisin)</small></Icon>
        }

        { props.loggedIn &&
        <NowPlaying>
          <AlbumArt src={props.nowPlaying.albumArt}/>
          <Song>{ props.nowPlaying.name }</Song>
        </NowPlaying>
        }
        </div>
    </HeaderBar>
    );
  }

  const HeaderBar = styled.header`
  background-color: #282c34;
  min-height: 3vh;
  display: flex;
  justify-content: space-between;
  font-size: 2vmin;
  color: white;
  min-width:100%;
  `


const Title = styled.div`
  font-weight: bold;
  justify-content: start;
  font-size: 3em; 
  color: #629bf3;
  text-shadow: 0 0 1px #000,0 0 3px #000;
  display:flex;
  `
 const NowPlaying = styled.div`
  max-width: 4mvw;
  padding-left: 2vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  `


const Icon = styled.div`
  font-size: 15px;
  text-align: center;
  float: right;
  padding: 5px 10px;
  color: #000;
  border-radius: 3px;
  background: #629bf3;
  margin: 5px;
  transition: 0.2s linear all;
  &:hover {
    background: #92cbf3;
    cursor: pointer;
  }
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`
const Logo = styled.img`
  height: 5vmin;
  margin: 2vmin;
  pointer-events: none;
  @media (prefers-reduced-motion: no-preference) {
      animation: ${spin} infinite 4s cubic-bezier(0.215, 0.610, 0.355, 1)
  }
  `

  const AlbumArt = styled.img`
  height: 6vmin;
  margin: 1vmin;
  `
const Song = styled.div`
  margin: 1vmin;
  `

export default Header;
