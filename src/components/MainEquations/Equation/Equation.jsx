import React from 'react';
import './Equation.css';

function Equation( props ) {
  return (
    <div className='equation-wrapper' >
        <span>X</span>
        <span className='equation-x-index'>{ props.equationId }</span>
        <span>&nbsp;=&nbsp;</span>
        { props.equationNumbers.map( ( number, index ) => {
            return (
                <span key={ index }>
                    { number >= 0 && index !== 0 && <span>+</span> }
                    <span>{ number }</span>
                    { index !== props.equationNumbers.length - 1 && <span>x<span className='equation-x-index'>{ index + 1 }</span></span> }
                </span>
            )
        } ) }
    </div>
  )
}

export default Equation;