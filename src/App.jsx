import React, { useState } from 'react';
import Context from './Context';
import Equations from './components/Equations/Equations';
import MainEquations from './components/MainEquations/MainEquations';
import Decision from './components/Decision/Decision';
import CompressionRatios from './components/CompressionRatios/CompressionRatios';
import './App.css';

const mainData = {
  
}

function App() {

  const [ size, setSize ]     = React.useState( 0 );
  const [ iterations, setIterations ]     = React.useState( { keys : [] } );
  const [ mainEquations, setMainEquations ]     = React.useState( {} );
  const [ compressionRatios, setCompressionRatios ] = React.useState( {} );
  const [ matrix, setMatrix ] = React.useState( 
    { 
      /*0 : {0: 25, 1: 1, 2: -3.5, 3: 5, keys: [0, 1, 2, 3], difference: true, coef: 1},
      1 : {0: 0, 1: 9.4, 2: -3.4, 3: -3, keys: [0, 1, 2, 3], difference: true, coef: 1},
      2 : {0: 1, 1: -1, 2: 7.3, 3: 0, keys: [0, 1, 2, 3], difference: true, coef: 1},*/
      // todo не забыть вернуть ключи в []
      keys              : [],//[0, 1, 2], 
      mainDiagonal      : [], 
      mainEquations     : {}, 
      compressionRatios : { alpha : 0, betta : 0, gamma : 0, least : 0 }, 
      iterations        : { keys : [] },
      E                 : 0.0001
    }
  );

  function populateMatrix( size ){
    const matrix = { 
      keys              : [],//[0, 1, 2], 
      mainDiagonal      : [], 
      mainEquations     : {}, 
      compressionRatios : { alpha : 0, betta : 0, gamma : 0, least : 0 }, 
      iterations        : { keys : [] },
      E                 : 0.0001
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
      const { allRatiosGood, results } = populateCompressionRatios();

      if( allRatiosGood ) {
        populateEquations();
        populateIterations();
    
        // writing state for rerender
        setIterations( matrix.iterations );
        setMainEquations( matrix.mainEquations );
        setCompressionRatios( matrix.compressionRatios )
        console.log( matrix );
      } else {
        alert( results );
      }
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
    /*matrix.keys.forEach( key => {
        const line = matrix[ key ];
        console.log( line, ' >> LINE' )
        if( !line.difference ) {
          result = false;
        }
      } )
      
      if( !result ){
        alert( 'В системе нет диагонального преобладания' );
      }*/
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

  function populateCompressionRatios() {
    populateCompressionRatioAlpha();
    populateCompressionRatioBetta();
    populateCompressionRatioGamma();
    return checkSufficientCondition();
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
      matrix.compressionRatios.alpha = A < alpha ? getRounding( alpha ) : A;
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
      matrix.compressionRatios.betta = B < betta ? getRounding( betta ) : B;
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
        console.log( item, ' >>> item' )
        if( key !== keyItem && keyItem < line.keys.length - 1 ){
          console.log(  Math.abs( item ) / MDN, ' >>> TEST' )
          gamma += Math.abs( item ) / MDN;
        }
      } )
    } );
    matrix.compressionRatios.gamma = getRounding( gamma );
  }

  function checkSufficientCondition() {
    const { alpha, betta, gamma } = matrix.compressionRatios;
    const results     = [ 'A sufficient condition is not met' ];
    let allRatiosGood = true;
    const resultsPush = ( text ) => {
      results.push( text );
      allRatiosGood = false;
    }

    if( alpha > 1 ){
      resultsPush( 'alpha is greater than 1' );
    }
    if( betta > 1 ){
      resultsPush( 'betta is greater than 1' );
    }
    if( gamma > 1 ){
      resultsPush( 'gamma is greater than 1' );
    }
    return {
      allRatiosGood,
      results : results.join( ', ' )
    }
  }

  function getFormulaAndLeast() {
    const { alpha, betta, gamma } = matrix.compressionRatios;
    if( alpha === 0 && betta === 0 && gamma === 0 ) {
      alert( 'alpha, beta, gamma not defined yet' );
    } else {
      let least = '';
      if( alpha < betta && alpha < gamma ){
        least = 'alpha';
      } else if( betta < gamma ) {
        least = 'betta';
      } else {
        least = 'gamma'
      }
      matrix.compressionRatios[ 'least' ] = least;

      return getFormula( least );
    }
  }

  function getFormula( least ){
    switch( least ){
      case 'alpha': 
        return ( roMax, ros ) => {
          const { alpha } = matrix.compressionRatios;
          return ( alpha / ( 1 - alpha ) ) * roMax;
        }

      case 'betta':
        return ( roMax, ros ) => {
          const { betta } = matrix.compressionRatios;
          let roSum = 0;
          ros.forEach( ro => roSum += ro );
          return ( betta / ( 1 - betta ) ) * roSum;
        }

      case 'gamma': 
        return ( roMax, ros ) => {
          const { gamma } = matrix.compressionRatios;
          let roSum = 0;
          ros.forEach( ro => roSum += ro * ro );
          return ( gamma / ( 1 - gamma ) ) * Math.sqrt( roSum );
        } 

      default: {}
    }
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
          equationValues.push( getRounding( value ) );
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
    while( getAccuracy() > matrix.E ){
      populateIteration();
    }
  }

  function populateIteration(){
    const iterationNumber = getIterationNumber();
    matrix.iterations[ iterationNumber ] = {}
    matrix.keys.forEach( key => { 
      const equation = matrix.mainEquations[ `x${ key }` ];
      let result     = 0;
      equation.forEach( ( number, index ) => {
        if( index === equation.length - 1 ) {
          result += number;
        } else {
          if( iterationNumber === 0  ) {
            result += number * 0;
          } else if( iterationNumber > 0 ) {
            const x = matrix.iterations[ iterationNumber - 1 ][ `x${ index }` ];
            result += number * x;
          }  
        }
      } )
      matrix.iterations[ iterationNumber ][ `x${ key }` ] = getRounding( result );
    } );
  }

  function getIterationNumber() {
    const { keys }  = matrix.iterations;
    const iteration = keys.length ? keys.length : 0;
    matrix.iterations.keys.push( iteration );
    return iteration;
  }

  function getAccuracy() {
    const iterationLength       = matrix.iterations.keys.length;
    const iterationLast         = matrix.iterations[ iterationLength - 1 ];
    const iterationPenultimate  = matrix.iterations[ iterationLength - 2 ];
    const ros = [];
    let roMax = 0;

    if( matrix.iterations.keys.length > 1 ){
      matrix.keys.forEach( matrixKey => {
        const ro      = iterationPenultimate[ `x${ matrixKey }` ] - iterationLast[ `x${ matrixKey }` ];
        const roRound = getRounding( ro )
        roMax = roMax > Math.abs( roRound ) ? roMax : Math.abs( roRound );
        ros.push( Math.abs( roRound ) )
      } )
      iterationLast[ 'roMax' ]  = roMax;
      iterationLast[ 'ros' ]    = ros;
    }
    const formula  = getFormulaAndLeast();
    const accuracy = getRounding( formula( roMax, ros ) );
    iterationLast[ 'accuracy' ] = accuracy;
    return accuracy;
  }

  function getRounding( number ) {
    return Number( number.toFixed( 4 ) );
  }

  return (
    <Context.Provider value={ { populateItem } }>
      <div className='container'>
        <h1>Method of successive approximations</h1>
        <div className='enter-size-wrapper'>
          <div className='enter-size-text'>Enter the size of the equation system</div>
          <input className='enter-size-input' onChange={ event => setSize( event.target.value ) }></input>
          <button onClick={ () => populateMatrix( size ) } >Send</button>
        </div>
        <Equations matrix={ matrix }/>
        { matrix.keys.length >= 1 && <button onClick={ () => handlerOnClickSandData() }>Send data</button> }

        <MainEquations mainEquations={ matrix.mainEquations }/>
        <CompressionRatios compressionRatios={ matrix.compressionRatios }/>
        <Decision iterations={ matrix.iterations } />
      
      </div>
    </Context.Provider>
  );
}

export default App;
