import React from 'react';
import Line from './Line';

function Equations( props ) {
 
  return (
    <div>
      { props.matrix.keys.map( lineId => {     
        const line = props.matrix[ lineId ];  
        return (
          <Line line={ line } lineId={ lineId } key={ lineId }/>
        )
      } ) }
    </div>
  )
}

export default Equations;