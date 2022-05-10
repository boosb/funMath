import React from 'react';
import Iteration from './Iteration/Iteration';
import Accuracy from './Accuracy/Accuracy';
import './Decision.css';

function Decision( props ) {

  return (
    <div>
      { props.iterations.keys.length > 0 && <h3>Accuracy</h3> }
      <div className='accuracy-wrapper'>
        { props.iterations.keys.map( key => {     
          const iteration = props.iterations[ key ];  
          return (
            <Accuracy iteration={ iteration } iterationKey={ key } key={ key }/>
          )
        } ) }
      </div>
      
      { props.iterations.keys.length > 0 && <h3>Iterations</h3> }
      <div className='iterations-wrapper'>
        { props.iterations.keys.map( key => {     
          const iteration = props.iterations[ key ];  
          return (
            <Iteration iteration={ iteration } iterationKey={ key } key={ key }/>
          )
        } ) }
      </div>
    </div>
  )
}

export default Decision;