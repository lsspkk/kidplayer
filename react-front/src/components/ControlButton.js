import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components'

export function ControlButton(props) {
  const isPlayButton = props.playing !== undefined
  const [shake, setShake] = useState(false)

  const action = () => {
    props.action()
    setShake(true)
    window.setTimeout((() => setShake(false)), 200)
  }

  return (
    <>
      <Block color={props.color} onClick={action}>
        {isPlayButton &&
          <PlayButton color={props.color} playing={props.playing} shake={shake}>
            {props.text}
          </PlayButton>
        }
        {!isPlayButton && !props.svg &&
          <TextButton color={props.color} shake={shake} >
            {props.text}
          </TextButton>
        }
        {!isPlayButton && props.svg &&
          <SvgButton color={props.color} shake={shake} >
            {props.svg === 'next' && <NextSvg />}
            {props.svg === 'previous' && <PreviousSvg />}
          </SvgButton>
        }
      </Block>
    </>
  );
}
function PreviousSvg(props) {
  return (
    <ButtonSvg width="298" height="281" viewBox="0 0 298 281" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M214.881 140.443C214.881 174.008 229.266 233.947 294 279.5C214.881 279.5 147.75 163.219 147.75 140.443C147.75 117.666 214.881 1.38525 294 1.38525C229.266 46.9385 214.881 106.877 214.881 140.443Z" fill="#ED8585" />
      <path d="M147.75 279.5C83.0164 233.947 68.6311 174.008 68.6311 140.443C68.6311 106.877 83.0163 46.9385 147.75 1.38525C68.6311 1.38525 1.50004 117.666 1.5 140.443C1.49996 163.219 68.6311 279.5 147.75 279.5Z" fill="#ED8585" />
      <path d="M214.881 140.443C214.881 174.008 229.266 233.947 294 279.5C214.881 279.5 147.75 163.219 147.75 140.443C147.75 117.666 214.881 1.38525 294 1.38525C229.266 46.9385 214.881 106.877 214.881 140.443Z" stroke="black" strokeWidth="2.39754" />
      <path d="M147.75 279.5C83.0164 233.947 68.6311 174.008 68.6311 140.443C68.6311 106.877 83.0163 46.9385 147.75 1.38525C68.6311 1.38525 1.50004 117.666 1.5 140.443C1.49996 163.219 68.6311 279.5 147.75 279.5Z" stroke="black" strokeWidth="2.39754" />
    </ButtonSvg>
  )
}
function NextSvg(props) {
  return (
    <ButtonSvg width="299" height="281" viewBox="0 0 299 281" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M83.6189 140.443C83.6189 174.008 69.2336 233.947 4.50001 279.5C83.6189 279.5 150.75 163.219 150.75 140.443C150.75 117.666 83.6189 1.38525 4.50007 1.38525C69.2337 46.9385 83.6189 106.877 83.6189 140.443Z" fill="#ED8585" />
      <path d="M150.75 279.5C215.484 233.947 229.869 174.008 229.869 140.443C229.869 106.877 215.484 46.9385 150.75 1.38525C229.869 1.38525 297 117.666 297 140.443C297 163.219 229.869 279.5 150.75 279.5Z" fill="#ED8585" />
      <path d="M83.6189 140.443C83.6189 174.008 69.2336 233.947 4.50001 279.5C83.6189 279.5 150.75 163.219 150.75 140.443C150.75 117.666 83.6189 1.38525 4.50007 1.38525C69.2337 46.9385 83.6189 106.877 83.6189 140.443Z" stroke="black" strokeWidth="2.39754" />
      <path d="M150.75 279.5C215.484 233.947 229.869 174.008 229.869 140.443C229.869 106.877 215.484 46.9385 150.75 1.38525C229.869 1.38525 297 117.666 297 140.443C297 163.219 229.869 279.5 150.75 279.5Z" stroke="black" strokeWidth="2.39754" />
    </ButtonSvg>

  )
}
const ButtonSvg = styled.svg`
  max-width: 80%;
  opacity: 0.5;
  margin: 9vw 5% 0;
  padding: 0 4%;
  box-shadow: 0 0 5px #fff, 0 0 5px #fff;;
  justify-self: center;

`

const Block = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
  background : ${props => props.color};
  width: 100%;
  height: 100%;
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
  font-size: 25vw;
  padding-bottom: 4vw;
  color: ${props => props.color};
  text-shadow: 0 0 1vw rgba(0,0,0,0.6);
  font-weight: bold;
  transition: all 0.2s linear;
  &:hover {
    cursor: pointer;
  }
`
const PlayButton = styled(Bar)`
@media (prefers-reduced-motion: no-preference) {
  animation: ${spin} infinite 4s linear;
  animation-play-state: ${props => props.playing ? 'running' : 'paused'};
}
${props => !props.shake ? '' : 'background-color:#aaa;transform: rotate(20deg);animation:none;'}
`
const TextButton = styled(Bar)`
  ${props => !props.shake ? '' : 'background-color:#aaa;transform: rotate(20deg);animation:none;'}
`

const SvgButton = styled(Bar)`
  ${props => !props.shake ? '' : 'background-color:#fff;transform: rotate(-20deg);animation:none;'}
`


export default ControlButton;
