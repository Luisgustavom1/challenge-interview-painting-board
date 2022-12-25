import React, { useState } from 'react';
import './styles.css'

interface Coordinates {
  x: number,
  y: number
}

interface Frame {
  coordinates: Coordinates
}

interface FrameAction {
  coordinates: Coordinates
  action: 'PAINT' | 'DELETE'
}

const stackPaintHistory: Array<FrameAction> = [];
const stackUndoHistory: Array<FrameAction> = [];

function generateCoordinate(x: number, y: number) {
  return `${x}-${y}`
}

export const Board = () => {
  const [frameList, setFrameList] = useState<Array<Frame>>([])

  function addFrameList(frame: Frame) {
    setFrameList(prevState => [...prevState, frame])
  }

  function removeFrameList(frame: Frame) {
    setFrameList((prevState) => prevState
      .filter(({ coordinates }) => 
        generateCoordinate(coordinates.x, coordinates.y) !== 
        generateCoordinate(frame.coordinates.x, frame.coordinates.y)
    ))
  }

  function toggleFrame(event: React.MouseEvent<HTMLSpanElement>) {
    event.stopPropagation()
    const frameCoordinates: Coordinates = {
      x: event.clientX, 
      y: event.clientY
    }
    const stringFrameCoordinates = generateCoordinate(frameCoordinates.x, frameCoordinates.y) 
    const alreadyFramePainted = frameList
      .find(({ coordinates }) => generateCoordinate(coordinates.x, coordinates.y) === stringFrameCoordinates)

    if (alreadyFramePainted) {
      removeFrameList({ coordinates: frameCoordinates })
      stackPaintHistory.push({
        coordinates: frameCoordinates,
        action: 'DELETE'
      })
      return;
    }

    addFrameList({
      coordinates: frameCoordinates
    })
    stackPaintHistory.push({
      coordinates: frameCoordinates,
      action: 'PAINT'
    })
  }

  function undoAction() {
    const lastAction = stackPaintHistory.pop()
    if (!lastAction) return

    stackUndoHistory.push(lastAction)

    if (lastAction.action === 'DELETE') {
      addFrameList({
        coordinates: lastAction.coordinates
      })

      return
    }

    removeFrameList({
      coordinates: lastAction.coordinates
    })
  }

  function redoAction() {
    const lastAction = stackUndoHistory.pop()
    if (!lastAction) return

    stackPaintHistory.push(lastAction)

    if (lastAction.action === 'PAINT') {
      addFrameList({
        coordinates: lastAction.coordinates
      })

      return
    }

    removeFrameList({
      coordinates: lastAction.coordinates
    })
  }

  return (
    <>
      <section className="actions-container">
        <button onClick={undoAction}>
          Undo
        </button>
        <button onClick={redoAction}>
          Redo
        </button>
      </section>

      <main 
        className="board-container"
        onClick={toggleFrame}
      >
        {frameList.map(({ coordinates }) => (
          <span 
            key={generateCoordinate(coordinates.x, coordinates.y)}
            data-coordinates={generateCoordinate(coordinates.x, coordinates.y)}
            className="frame painted"
            style={{
              top: coordinates.y,
              left: coordinates.x
            }}
          />
        ))}
    </main>
    </>
  );
};