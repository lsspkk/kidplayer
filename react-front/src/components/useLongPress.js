import { useState, useEffect } from 'react'

export default function useLongPress(callback = () => { }, ms = 1000) {
  const [startLongPress, setStartLongPress] = useState(false)

  useEffect(() => {
    const runCallback = () => {
      setStartLongPress(false)
      callback()
    }

    let timerId
    if (startLongPress) {
      timerId = setTimeout(runCallback, ms)
    } else {
      clearTimeout(timerId)
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [callback, ms, startLongPress])

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false)
  }
}
