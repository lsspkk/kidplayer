import React, { useState } from 'react'
import styled from 'styled-components'
import { Arrow, PlayingArrow } from './Arrows'

export function Albums(props) {
  console.log(props)
  const [newName, setNewName] = useState('')

  const addAlbum = () => {
    props.saveAlbums({ all: [newName, ...props.albums.all], playing: props.albums.playing })
    setNewName('')
  }
  const removeAlbum = (album) => {
    const playing = props.albums.playing === album ? '' : props.albums.playing
    props.saveAlbums({ all: props.albums.all.filter(a => a !== album), playing: playing })
  }

  return (
    <Content>
      <Row>
        <h3>Lisää</h3>
      </Row>
      <Row>
        <AlbumInput type='text' onChange={(e) => { setNewName(e.target.value) }} /><Icon onClick={() => addAlbum()}>Lisää</Icon>
      </Row>
      <Row><h1>Albumit</h1></Row>
      {props.albums.all.map((a) => (
        <Row key={'row' + a}>
          <Name
            playing={props.albums.playing === a}
            key={'i' + a}
            onClick={() => props.setPlayingAlbum(a)}>
            {props.albums.playing === a ? <PlayingArrow /> : <Arrow />}
            {a}
          </Name>

          <Right>
            <Icon key={'r' + a} onClick={() => removeAlbum(a)}>Poista</Icon>
          </Right>
        </Row>
      ))
      }
    </Content >
  )
}
const Button = styled.div`
  box-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  font-size: 1em;
  text-align: center;
  padding: 1em;
  background: #629bf3;
  transition: 0.2s linear all;
  cursor: pointer;
  border-radius: 3px;
  &:hover {
    background: #92cbf3;
  }
`
const Name = styled(Button)`
  width: 100%;
  padding: 0.7em;
  font-weight: bold;
  font-size: 1.3em;
  color:  #fff;
  ${props => props.playing && 'cursor: auto;'};
  background: ${props => props.playing ? '#92cbf3' : '#629bf3'};
  cursor: ${props => props.playing ? 'normal' : 'pointer'};
  &:hover {
    background: '#92cbf3';
    path {
      ${props => props.playing ? '' : 'stroke: #629bf3'};
    }
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

const Icon = styled(Button)`
  font-size: 1em;
  text-align: center;
  float: right;
  color: #000;
  margin-left: 2em;
`

export default Albums
