import React, { useState  } from 'react';
import styled,{keyframes} from 'styled-components'

export function Button(props) {
    console.log(props)
    const isPlayButton = props.playing !== undefined
    const [shake, setShake] = useState(false)
    
    const action = () => {
      props.action()
      setShake(true)
      window.setTimeout((()=> setShake(false)), 200)
    }

    return (
      <>
        <Block color={props.color}>
        {isPlayButton &&
        <PlayButton onClick={action} color={props.color} playing={props.playing} shake={shake}>
          {props.text}
        </PlayButton>
        }
        { !isPlayButton &&
        <ClickButton onClick={action} color={props.color} shake={shake}>
          {props.text}
        </ClickButton>
        }
        </Block>
      </>
    );
  }

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
${props => !props.shake ? '' : 'color:#000;transform: rotate(20deg);animation:none;' }
`
const ClickButton = styled(Bar)`
  ${props => !props.shake ? '' : 'color:#000;transform: rotate(20deg);animation:none;' }
`


export default Button;
