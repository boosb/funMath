import React from 'react';
import Iteration from './Iteration';
import './Decision.css';

function Decision( props ) {

  return (
    <div className='iterations-wrapper'>
      { props.iterations.keys.map( key => {     
        const iteration = props.iterations[ key ];  
        return (
          <Iteration iteration={ iteration } iterationKey={ key } key={ key }/>
        )
      } ) }
    </div>
  )
}

export default Decision;