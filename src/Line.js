import React from 'react';
import Item from './Item';

function Line( props ) {
  const length = props.line.keys.length;
 
  return (
    <div>
      { props.line.keys.map( ( itemId, index ) => {       
        return (
          <Item 
            lastItem={ index === length - 1 } 
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