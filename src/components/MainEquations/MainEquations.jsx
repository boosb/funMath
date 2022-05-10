import React from 'react';
import Equation from './Equation/Equation';
import './MainEquations.css';

function MainEquations( props ) {
  const keys = Object.keys( props.mainEquations );

  return (
    <div>
        { keys.length > 0 && <h3>Equations</h3> }
        <div className='main-equations-wrapper' >
            { keys.map( key => {     
                const equationNumbers = props.mainEquations[ key ];  
                return (
                <Equation 
                    equationNumbers={ equationNumbers } 
                    equationId={ Number( key.slice( 1 ) ) + 1 } 
                    key={ key }
                />
                )
            } ) }
        </div>
    </div>
  )
}

export default MainEquations;