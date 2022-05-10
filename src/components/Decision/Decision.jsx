import React from 'react';
import Iteration from './Iteration/Iteration';
import Accuracy from './Accuracy/Accuracy';
import './Decision.css';

function Decision( props ) {
  const ids   = Object.keys( props.iterations );
  const keys  = ids.length > 10 ? [ ...ids.splice( 0, 4 ), ...ids.splice( ids.length - 6, 6 ) ] : ids;

  return (
    <div>
      { keys.length > 0 && <h3>Accuracy</h3> }
      <div className='accuracy-wrapper'>
        { keys.map( key => {     
          const iteration = props.iterations[ key ];  
          return (
            <Accuracy 
              iteration={ iteration } 
              iterationKey={ key } 
              key={ key }
            />
          )
        } ) }
      </div>
      
      { keys.length > 0 && <h3>Iterations</h3> }
      <div className='iterations-wrapper'>
        { keys.map( key => {     
          const iteration = props.iterations[ key ];  
          return (
            <Iteration 
              iteration={ iteration } 
              iterationKey={ key } 
              key={ key }
            />
          )
        } ) }
      </div>
    </div>
  )
}

export default Decision;