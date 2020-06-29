import React from 'react'
import styled, { keyframes } from 'styled-components'

export const PlayingArrow = (props) => {
  return (
    <Svg width='20' height='24' viewBox='0 0 20 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1.5 2.47372L18 12L1.5 21.5263V2.47372Z' fill='#92CBF3' stroke='#0064FF' stroke-width='2' />
    </Svg>
  )
}
export const Arrow = (props) => {
  return (
    <Svg width='20' height='24' viewBox='0 0 20 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1.5 2.47372L18 12L1.5 21.5263V2.47372Z' fill='#FFFFFF' stroke='#AAAAAA' stroke-width='2' />
    </Svg>
  )
}

const Svg = styled.svg`
  margin-left: -20px;
  display:block;
  position:relative;
  float: left;
  left: -30px;
`

const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

const Bar = styled.div`
font - size: 25vw;
padding - bottom: 4vw;
color: ${props => props.color};
text - shadow: 0 0 1vw rgba(0, 0, 0, 0.6);
font - weight: bold;
transition: all 0.2s linear;
  &: hover {
  cursor: pointer;
}
`
const PlayButton = styled(Bar)`
@media(prefers - reduced - motion: no - preference) {
  animation: ${spin} infinite 4s linear;
  animation - play - state: ${props => props.playing ? 'running' : 'paused'};
}
${props => !props.shake ? '' : 'background-color:#aaa;transform: rotate(20deg);animation:none;'}
`
const ClickButton = styled(Bar)`
${props => !props.shake ? '' : 'background-color:#aaa;transform: rotate(20deg);animation:none;'}
`

const SvgButton = styled(Bar)`
${props => !props.shake ? '' : 'background-color:#fff;transform: rotate(-20deg);animation:none;'}
`
