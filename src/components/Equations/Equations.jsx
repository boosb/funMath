import React from 'react';
import Line from './Line/Line';

function Equations( props ) {
  const keys = Object.keys( props.matrix.value );

  return (
    <div>
      { keys.map( lineId => {     
        const line = props.matrix.value[ lineId ][ 'line' ];  
        return (
          <Line   line={ line } lineId={ lineId } key={ lineId }/>
        )
      } ) }
    </div>
  )
}

export default Equations;