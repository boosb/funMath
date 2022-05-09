import React from 'react';
import IterationItem from './IterationItem';
import './Iteration.css';

function Iteration( props ) {
  const keys = Object.keys( props.iteration );


  return (
    <div className='iteration-wrapper'>
      { keys.map( ( key, index ) => {       
        return (
          <IterationItem 
            number={ props.iteration[ key ] }
            iterationKey={ props.iterationKey }
            index={ index }
            iterationItemKey={ key }
            key={ key }
            
          />
        )
      } ) }
    </div>
  )
}

export default Iteration;