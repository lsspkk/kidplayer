import React from 'react'
import styled from 'styled-components'

export const PlayingArrow = (props) => {
  return (
    <Svg width='20' height='24' viewBox='0 0 20 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1.5 2.47372L18 12L1.5 21.5263V2.47372Z' fill='#FFFFFF' stroke='#0064FF' strokeWidth='2' />
    </Svg>
  )
}
export const Arrow = (props) => {
  return (
    <Svg width='20' height='24' viewBox='0 0 20 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M1.5 2.47372L18 12L1.5 21.5263V2.47372Z' fill='none' stroke='none' strokeWidth='2' />
    </Svg>
  )
}

const Svg = styled.svg`
  float: left;
  align-self: center;
`
