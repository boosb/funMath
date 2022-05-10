import React from 'react';
import Item from '../Item/Item';

function Line( props ) {
  const lineKeys = Object.keys( props.line );
 
  return (
    <div>
      { lineKeys.map( ( itemId, index ) => {       
        return (
          <Item 
            lastItem={ index === lineKeys.length - 1 } 
            lineId={ props.lineId }
            itemId={ itemId } 
            key={ itemId }
          />
        )
      } ) }
    </div>
  )
}

export default Line;