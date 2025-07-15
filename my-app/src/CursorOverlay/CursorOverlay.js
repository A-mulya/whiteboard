import React from 'react';
import { useSelector } from 'react-redux';
import cursorIcon from '../resources/cursor.svg';
import { getMySocketId } from '../socketConn/socketConn';

const CursorOverlay = () => {
  const cursors = useSelector(state => state.cursor.cursors);
  const mySocketId = getMySocketId();

  return (
    <>
      {cursors
        .filter(c => c.userId !== mySocketId) // ignore my own cursor
        .map(c => (
          <img
            key={c.userId}
            className="cursor"
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y,
              width: '30px',
              pointerEvents: 'none',
            }}
            src={cursorIcon}
            alt="User cursor"
          />
        ))}
    </>
  );
};

export default CursorOverlay;
