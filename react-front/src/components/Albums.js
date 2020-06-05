import React, { useState  } from 'react';
import styled from 'styled-components'


export function Albums(props) {
  console.log(props)
  const [newName, setNewName] = useState('')

  const addAlbum = () => {
    props.saveAlbums({all: [newName, ...props.albums.all], playing: props.albums.playing})
    setNewName('')
  }
  const removeAlbum = (album) => {
    const playing =  props.albums.playing === album ? '' : props.albums.playing
    props.saveAlbums({ all: props.albums.all.filter(a => a !== album), playing: playing})
  }
  return (
    <Content>
      <Row>
        <h3>Lisää</h3>
      </Row>
      <Row>
      <AlbumInput type="text" onChange={(e) => { setNewName(e.target.value)}}/><Icon onClick={() => addAlbum()}>Lisää</Icon>
      </Row>
      <Row><h1>Albumit</h1></Row>
      { props.albums.all.map((a) => (
          <Row key={'row'+a}>
          <Name playing={props.albums.playing === a} key={'i'+a} onClick={() => props.setPlayingAlbum(a)}>
            {props.albums.playing === a && <NowPlaying>SOI</NowPlaying>}
            {a}
            </Name>
          <Right><Icon key={'r'+a} onClick={() => removeAlbum(a)}>Poista</Icon></Right>
          </Row>
          )
        )
      }
    </Content>
    )
  }
  const NowPlaying = styled.div`
  display: inline-flex;
  padding-right: 1em;
  color: #c3c3c3;
  text-shadow: 0 0 2px #07352b;
  `


  const Name = styled.div`
  width: 100%;
  padding: 0.7em;
  font-weight: bold;
  font-size: 1.3em;
  color: ${props => props.playing ? '#629bf3' : '#fff'};
  background: ${props => props.playing ? '#efe' : '#629bf3'};
  &:hover {
    cursor: ${props => props.playing ? 'normal' : 'pointer'};
  }
  `


  const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 1vh 3vw;
  max-width: 500px;
  width: 100%;
  `
  const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 0.2em;
  align-items: center;
  `
  const Right = styled.div`
  justify-self: flex-end;
  flex:1;
`
const AlbumInput = styled.input`
  padding: 0.5em;
  width: 80%;
`
  
const Icon = styled.div`
  font-size: 1em;
  text-align: center;
  float: right;
  padding: 1em;
  color: #000;
  border-radius: 3px;
  background: #629bf3;
  margin-left: 2em;
  transition: 0.2s linear all;
  &:hover {
    background: #92cbf3;
    cursor: pointer;
  }
`


export default Albums;
