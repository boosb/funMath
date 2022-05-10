import React from 'react';
import './ResidualVector.css';

// formula for finding the residual vector: F - A * X = r
function ResidualVector( props ) {

  const matrixF = [];
  const matrixA = [];
  const matrixX = [];

  const iterationKeys   = Object.keys( props.iterations );
  const matrixKeys      = Object.keys( props.matrix );
  const iterationLast   = props.iterations[ iterationKeys.slice( -1 ) ];

  matrixKeys.forEach( key => {
      const matrixAItem   = [];
      const matrixFItem   = [];
      const line          = props.matrix[ key ][ 'line' ];
      const lineKeys      = Object.keys( line );
      //const resultNumbers = lineKeys.map( lineKey => line[ lineKey ] );

      lineKeys.forEach( lineKey => {
          if( Number( lineKey ) !== lineKeys.length - 1 ) {
            matrixAItem.push( line[ lineKey ] );
          } else {
            matrixFItem.push( line[ lineKey ] );
          }
      } )

      matrixA.push( matrixAItem );
      matrixF.push( matrixFItem );
  } );
  console.log( iterationLast, '  iterationLast' )
  const iterationLastKeys = iterationLast ? Object.keys( iterationLast ) : [];
  iterationLastKeys.forEach( key => {
    if( key !== 'accuracy' && key !== 'roMax' && key !== 'ros' ){
      matrixX.push( iterationLast[ key ] )
    }
  } )

  console.log( matrixA, ' >> matrixA' );
  console.log( matrixF, ' >> matrixF' );
  console.log( matrixX, ' >> matrixX' );
  console.log( iterationLast, ' >> iterationLast' );

  const aMultipliedX = matrixA.map( numbers => {
    let result = 0;
    const additionForNumbers = numbers.map( ( num, idx ) => num * matrixX[ idx ] );
    additionForNumbers.forEach( num => result += num );
    return Number( result.toFixed( 5 ) );
  } )

  const subtraction = matrixF.map( ( num, idx ) => {
      const result = num - aMultipliedX[ idx ];
      return Number( result.toFixed( 5 ) );
  } );

  console.log( aMultipliedX, ' >>> aMultipliedX' )
  console.log( subtraction, ' >>> subtraction' )

  if( iterationKeys.length > 0 ) {
    return (
        <div >
          { iterationKeys.length > 0 && <h3>Residual vector</h3> }
    
          <div className='residual-vector-wrapper'>
            <div className='residual-vector-item'>
              { matrixF.map( num => <div>{ num }</div> ) }
            </div>
    
            { iterationKeys.length > 0 && <div className='residual-vector-minus residual-vector-item'>&#8722;</div> }
    
            <div className='residual-vector-item'>
              { matrixA.map( numbers => 
                <div>{ numbers.map( num => <span>&nbsp;&nbsp;&nbsp;{ num }&nbsp;&nbsp;&nbsp;</span> ) }</div> ) }
            </div>
    
            { iterationKeys.length > 0 && <div className='residual-vector-multiplication residual-vector-item'>&#215;</div> }
    
            <div className='residual-vector-item'>
              { matrixX.map( num => <div>{ num }</div> ) }
            </div>
    
            { iterationKeys.length > 0 && <div className='residual-vector-equals residual-vector-item'>=</div> }
    
            <div className='residual-vector-item'>
              { subtraction.map( num => <div>{ num }</div> ) }
            </div>
          </div>
    
        </div>
      )
  }
}

export default ResidualVector;