import React, { useState } from 'react'
import styled from 'styled-components'
import { Arrow, PlayingArrow } from './Arrows'

export function Albums (props) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  const nowPlayingAlbumQuery = ('query' in props.albums.playing) ? props.albums.playing : ''

  const addAlbum = () => {
    props.searchFirstMatchingAlbum(query)
      .then(
        (album) => {
          props.saveAlbums({
            all:
              [{ query: query, album: album }, ...props.albums.all],
            playing: props.albums.playing
          })
          setQuery('')
        }
      )
      .catch(error => setError(error))
  }
  const removeAlbum = (album) => {
    const playing = nowPlayingAlbumQuery === album.query ? {} : props.albums.playing
    props.saveAlbums({ all: props.albums.all.filter(a => a.query !== album.query), playing: playing })
  }

  return (
    <Content>
      <Row>
        <h3>Lisää</h3>
      </Row>
      <Row>
        <AlbumInput type='text' onChange={(e) => { setQuery(e.target.value); setError('') }} /><Icon onClick={() => addAlbum()}>Lisää</Icon>
      </Row>
      {error && <Row><Message>{error}</Message></Row>}
      <Row><h1>Albumit</h1></Row>
      {props.albums.all.length == 0 && <Message>Albumien lista on tyhjä</Message>}
      {props.albums.all.map((item, index) => (
        <Row key={'row' + item.query}>
          <Box
            playing={nowPlayingAlbumQuery === item.query}
            key={'i' + item.query}
            onClick={() => props.setPlayingAlbum(item)}>
            {nowPlayingAlbumQuery === item.query ? <PlayingArrow /> : <Arrow />}
            <Names>
              {item.query}
              <AlbumName>{item.album.name}</AlbumName>
            </Names>
          </Box>

          <Right>
            <Icon key={'r' + item.query} onClick={() => removeAlbum(item)}>Poista</Icon>
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
  color: #FFFFFF;
  background: #629bf3;
  transition: 0.2s linear all;
  cursor: pointer;
  border-radius: 3px;
  &:hover {
    background: #92cbf3;
  }
`
const Box = styled(Button)`
  display: flex;
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
      ${props => props.playing ? '' : 'fill: #FFFFFF'};
    }
  }
`

const Names = styled.div`
  width: 100%;
  `

const AlbumName = styled.div`
  color: #FFFFFF;
  font-size: 0.6em;
  font-weight: normal;
  `
const Message = styled.div`
  color: #92bbd3;
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
  margin-left: 2em;
`

export default Albums
