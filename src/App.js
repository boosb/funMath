import React, { useState } from 'react';
import Context from './Context';
import Equations from './Equations';
import Decision from './Decision';

function App() {

  const [ size, setSize ]     = React.useState( 0 );
  const [ iterations, setIterations ]     = React.useState( { keys : [] } );
  const [ matrix, setMatrix ] = React.useState( 
    { 
      0 : {0: 25, 1: 1, 2: -3.5, 3: 5, keys: [0, 1, 2, 3], difference: true, coef: 1},
      1 : {0: 0, 1: 9.4, 2: -3.4, 3: -3, keys: [0, 1, 2, 3], difference: true, coef: 1},
      2 : {0: 1, 1: -1, 2: 7.3, 3: 0, keys: [0, 1, 2, 3], difference: true, coef: 1},
      // todo не забыть вернуть ключи в []
      keys              : [0, 1, 2], 
      mainDiagonal      : [], 
      mainEquations     : {}, 
      compressionRatios : { alpha : 0, betta : 0, gamma : 0 }, 
      iterations        : { keys : [] },
      E                 : 0.0001,
      formula           : getFormula()
    }
  );

  function populateMatrix( size ){
    const matrix = { 
      keys              : [0, 1, 2], 
      mainDiagonal      : [], 
      mainEquations     : {}, 
      compressionRatios : { alpha : 0, betta : 0, gamma : 0 }, 
      iterations        : { keys : [] },
      E                 : 0.0001,
      formula           : null,
    };
    for( let i = 0; i < size; i++ ){
      const matrixLine = { keys : [], difference : true, coef : 1 };

      for( let i = 0; i <= size; i++ ){
        matrixLine[ i ] = 0;
        matrixLine.keys.push( i );
      }

      matrix[ i ] = matrixLine;
      matrix.keys.push( i );
    }

    setMatrix( matrix );
  }

  function populateItem( value, lineId, itemId ) {
    matrix[ lineId ][ itemId ] = value;
  }

  function handlerOnClickSandData() {
    convertToNumber();
    createMainDiagonal();
    populateDifferenceInLine();
    if( checkMatrixDifference() ) {
      //populateCoefficients(); todo не работает, надо пильть приведение к диагональному преобладанию
      populateCompressionRatioAlpha();
      populateCompressionRatioBetta();
      populateCompressionRatioGamma();
      populateEquations();
  
      populateIterations();
  
      console.log( matrix );
    }
  }

  function convertToNumber(){
    matrix.keys.forEach( lineId => {
      const line = matrix[ lineId ];
      line.keys.forEach( itemId => {
        const num = Number( line[ itemId ] );
        if( num || num === 0 ) {
          matrix[ lineId ][ itemId ] = num;
        } else {
          alert( 'enter to number' );
        }
      } )
    } )
    console.log( matrix )
  }

  function createMainDiagonal(){
    matrix.keys.forEach( lineId => matrix.mainDiagonal.push( matrix[ lineId ][ lineId ] ) );
  }

  function populateDifferenceInLine() {
    matrix.keys.forEach( lineId => {
      const line      = matrix[ lineId ];
      const numDgl    = matrix.mainDiagonal[ lineId ];
      let numForDiff  = 0;
      line.keys.forEach( itemId => {
        if( itemId !== lineId && itemId !== line.length - 1 ){
          numForDiff += Math.abs( line[ itemId ] );
        }
      } )
      matrix[ lineId ].difference = numDgl > numForDiff;
    } )
  }

  function checkMatrixDifference() {
      let result = true;
      matrix.keys.forEach( key => {
        const line = matrix[ key ];
        if( !line.difference ) {
          result = false;
        }
      } )
      
      if( !result ){
        alert( 'В системе нет диагонального преобладания' );
      }
      return result;
  }

  // todo доработать или переработать или ваще убрать
  function populateCoefficients() {
    const arr = [];
    matrix.keys.forEach( lineId => {
      if( !matrix[ lineId ].difference ){
        arr.push( matrix[ lineId ] );
      }
    } );

    const arrOne = []

    for( let i = 0; i <= size; i++ ){
      for( let j = 0; j < arr.length; j++ ){
        arrOne.push( [ arr[ j ][ i ], arr[ j ].coef ] )
      }
    }
  }

  function populateCompressionRatioAlpha() {
    matrix.keys.forEach( key => { 
      const { alpha : A } = matrix.compressionRatios;
      const line  = matrix[ key ];
      const MDN   = matrix.mainDiagonal[ key ]; // mainDiagonalNumber
      let alpha   = 0;

      line.keys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem && keyItem < line.keys.length - 1 ){
          alpha += Math.abs( item ) / MDN;
        }
      } )
      matrix.compressionRatios.alpha = A < alpha ? alpha : A;
    } );
  }

  function populateCompressionRatioBetta() {
    const data  = { keys : [] }
    matrix.keys.forEach( key => { 
      data[ key ] = [];
      matrix.keys.forEach( keyTwo => {
        const MDN = matrix.mainDiagonal[ keyTwo ]; // mainDiagonalNumber
        data[ key ].push( matrix[ keyTwo ][ key ] / MDN );
      } )
      data.keys.push( key );
    } );

    data.keys.forEach( key => {
      const { betta : B } = matrix.compressionRatios;
      let betta = 0;
      data[ key ].forEach( ( num, index ) => {
        if( key !== index ){
          betta += Math.abs( num );
        }
      } )
      matrix.compressionRatios.betta = B < betta ? betta : B;
    } )
    console.log( 'DATA' )
    console.log( data )
    //matrix.compressionRatios.gamma = gamma;
  }
  
  function populateCompressionRatioGamma() {
    let gamma = 0;
    matrix.keys.forEach( key => { 
      const line  = matrix[ key ];
      const MDN   = matrix.mainDiagonal[ key ]; // mainDiagonalNumber

      line.keys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem && keyItem < line.keys.length - 1 ){
          gamma += Math.abs( item ) / MDN;
        }
      } )
    } );
    matrix.compressionRatios.gamma = gamma;
  }

  function getFormula() {
    return ( alpha, num ) => ( alpha / ( 1 - alpha ) ) * num;
  }

  function populateEquations() {
    matrix.keys.forEach( key => { 
      const line  = matrix[ key ];
      const MDN   = matrix.mainDiagonal[ key ]; // mainDiagonalNumber
      const equationValues  = [];

      line.keys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem ){
          let value = null;
          if( keyItem < line.keys.length - 1 ) {
            value = item > 0 ? ( item / MDN ) * ( -1 ) : Math.abs( item ) / MDN;
          } else {
            value = item / MDN;
          }
          equationValues.push( value );
        } else if( key === keyItem ){
          equationValues.push( 0 );
        }
      } )
      matrix.mainEquations[ `x${ key }` ] = equationValues;
    } );
  }

  function populateIterations() {
    populateIteration();
    populateIteration();
    while( getRo() > matrix.E ){
      populateIteration();
    }
  }

  function populateIteration(){
    const iterationNumber = getIterationNumber();
    matrix.iterations[ iterationNumber ] = {}
    matrix.keys.forEach( key => { 
      const equation        = matrix.mainEquations[ `x${ key }` ];
      let result            = 0;

      console.log( equation , '  >> equation' )
      console.log( iterationNumber, ' >>> iterationNumber' )
      equation.forEach( ( number, index ) => {
        if( index === equation.length - 1 ) {
        

          console.log( number, ' >> number-3' )
          result += number;
        } else {
          if( iterationNumber === 0  ) {
            console.log( number, ' >> number-1' )
            result += number * 0;
          } else if( iterationNumber > 0 ) {
           // const iterationKeys = matrix.iterations.keys;
           console.log( number, ' >> number-2' )
            const x = matrix.iterations[ iterationNumber - 1 ][ `x${ index }` ];
            console.log( x , ' >>> X' )
            result += number * x;
          }  
        }
      } )
      console.log( result,  ' >> RESULT' )
      matrix.iterations[ iterationNumber ][ `x${ key }` ] = Number( result.toFixed( 4 ) );
    } );
  }

  function getIterationNumber() {
    const { keys }  = matrix.iterations;
    const iteration = keys.length ? keys.length : 0;
    matrix.iterations.keys.push( iteration );
    return iteration;
  }

  function getRo() {
    let roMax = 0;
    if( matrix.iterations.keys.length > 1 ){
      const iterationLength       = matrix.iterations.keys.length;
      const iterationLast         = matrix.iterations[ iterationLength - 1 ];
      const iterationPenultimate  = matrix.iterations[ iterationLength - 2 ];
      matrix.keys.forEach( matrixKey => {
        const ro = iterationPenultimate[ `x${ matrixKey }` ] - iterationLast[ `x${ matrixKey }` ];
        roMax = roMax > Math.abs( ro ) ? roMax : Math.abs( ro );
      } )

      iterationLast[ 'ro' ] = roMax;
    }
    console.log( matrix.formula( matrix.compressionRatios.alpha, roMax ), ' >>> MEGA_TEST' )
    return matrix.formula( matrix.compressionRatios.alpha, roMax );
  }

  return (
    <Context.Provider value={ { populateItem } }>
      <div>
        <p>Enter the size of the equation system</p>
        <input onChange={ event => setSize( event.target.value ) }></input>
        <button onClick={ () => /*populateMatrix( size )*/ console.log('HI') } >Send</button>
        <Equations matrix={ matrix }/>
        { matrix.keys.length >= 1 && <button onClick={ () => handlerOnClickSandData() }>Send data</button> }
        { matrix.iterations.keys >= 2 && <Decision iterations={ matrix.iterations } ></Decision> }

        <button onClick={ () => setIterations( matrix.iterations ) }>Send test</button>
        <Decision iterations={ iterations } ></Decision>
      </div>
    </Context.Provider>
  );
}

export default App;
