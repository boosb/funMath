import React from 'react';
import Context from './Context';
import Equations from './components/Equations/Equations';
import MainEquations from './components/MainEquations/MainEquations';
import Decision from './components/Decision/Decision';
import CompressionRatios from './components/CompressionRatios/CompressionRatios';
import ResidualVector from './components/ResidualVector/ResidualVector';
import './App.css';

function App() {
  // Required accuracy
  const E = 0.0001;

  // Object matrix
  const M = {
    value         : {},
    mainDiagonal  : []
  };

  // Object main data
  const D = {
    mainEquations     : {},
    compressionRatios : { alpha : 0, betta : 0, gamma : 0, least : null }, 
    iterations        : {},
  }

  const [ size, setSize ]         = React.useState( 0 );
  const [ mainData, setMainData ] = React.useState( D );
  const [ matrix, setMatrix ]     = React.useState( M );

  function populateMatrix( size ){
    const matrix = M;
    for( let i = 0; i < size; i++ ){
      const matrixLine = { line : {}, difference : true, coef : 1 /* todo: данное значение требовалось для приведение в диагональному преобладанию */ };
      for( let i = 0; i <= size; i++ ){
        matrixLine[ 'line' ][ i ] = 0;
      }
      matrix.value[ i ] = matrixLine;
    }
    setMatrix( matrix );
  }

  function populateItem( num, lineId, itemId ) {
    matrix.value[ lineId ][ 'line' ][ itemId ] = num;
  }

  function handlerOnClickSandData() {
    convertToNumber();
    createMainDiagonal();
    populateDifferenceInLine();
    if( checkMatrixDifference() ) {
      //populateCoefficients(); todo не работает, надо пильть приведение к диагональному преобладанию
      const data = D;
      populateEquations( data );
      const { allRatiosGood, results } = populateCompressionRatios( data );
      
      if( allRatiosGood ) {
        populateIterations( data );
        console.log( matrix, ' >>> matrix' )
        console.log( data, ' >>> mainData' )
        setMainData( data )
      } else {
        alert( results );
      }
    }
  }

  function convertToNumber(){
    const keys = Object.keys( matrix.value );

    keys.forEach( lineId => {
      const line      = matrix.value[ lineId ][ 'line' ];
      const lineKeys  = Object.keys( line )
      lineKeys.forEach( itemId => {
        const num = Number( line[ itemId ] );
        if( num || num === 0 ) {
          matrix.value[ lineId ][ 'line' ][ itemId ] = num;
        } else {
          alert( 'enter to number' );
        }
      } )
    } )
  }

  function createMainDiagonal(){
    // clean mainDiagonal
    matrix.mainDiagonal = [];

    const keys = Object.keys( matrix.value );
    keys.forEach( lineId => matrix.mainDiagonal.push( matrix.value[ lineId ][ 'line' ][ lineId ] ) );
  }

  function populateDifferenceInLine() {
    const keys = Object.keys( matrix.value );
    keys.forEach( lineId => {
      const line      = matrix.value[ lineId ][ 'line' ];
      const lineKeys  = Object.keys( line );
      const numDgl    = matrix.mainDiagonal[ lineId ];
      let numForDiff  = 0;
      lineKeys.forEach( itemId => {
        if( itemId !== lineId && Number( itemId ) !== lineKeys.length - 1 ){
          numForDiff += Math.abs( line[ itemId ] );
        }
      } )
      matrix.value[ lineId ].difference = Math.abs( numDgl ) > numForDiff;
    } )
  }

  function checkMatrixDifference() {
    console.log( matrix, ' >>> matrix' )
        console.log( mainData, ' >>> mainData' )
      const keys = Object.keys( matrix.value );
      let result = true;
      keys.forEach( key => {
        const line = matrix.value[ key ];
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
  /*function populateCoefficients() {
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
  }*/

  function populateCompressionRatios( data ) {
    populateCompressionRatioAlpha( data );
    populateCompressionRatioBetta( data );
    populateCompressionRatioGamma( data );
    return checkSufficientCondition( data );
  }

  function populateCompressionRatioAlpha( data ) {
    const keys = Object.keys( matrix.value );
    keys.forEach( key => { 
      const { alpha : A } = data.compressionRatios;
      const line      = matrix.value[ key ][ 'line' ];
      const lineKeys  = Object.keys( line );
      const MDN       = matrix.mainDiagonal[ key ]; // mainDiagonalNumber
      let alpha       = 0;

      lineKeys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem && keyItem < lineKeys.length - 1 ){
          alpha += Math.abs( item / MDN );
        }
      } )
      data.compressionRatios.alpha = A < alpha ? getRounding( alpha ) : A;
    } );
  }

  function populateCompressionRatioBetta( data ) {
    const keys      = Object.keys( matrix.value );
    const ratioData = {}
    keys.forEach( key => { 
      ratioData[ key ] = [];
      keys.forEach( keyTwo => {
        const MDN = matrix.mainDiagonal[ keyTwo ]; // mainDiagonalNumber
        ratioData[ key ].push(  matrix.value[ keyTwo ][ 'line' ][ key ] / MDN );
      } )
    } );

    Object.keys( ratioData ).forEach( key => {
      const { betta : B } = data.compressionRatios;
      let betta = 0;
      ratioData[ key ].forEach( ( num, index ) => {
        if( Number( key ) !== index ){
          betta += Math.abs( num );
        }
      } )
      data.compressionRatios.betta = B < betta ? getRounding( betta ) : B;
    } )
  }
  
  function populateCompressionRatioGamma( data ) {
    const keys = Object.keys( matrix.value );
    let gamma  = 0;
    keys.forEach( key => { 
      const line      = matrix.value[ key ][ 'line' ];
      const lineKeys  = Object.keys( line );
      const MDN       = matrix.mainDiagonal[ key ]; // mainDiagonalNumber

      lineKeys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem && keyItem < lineKeys.length - 1 ){
          gamma += ( item / MDN ) * ( item / MDN );
        }
      } )
    } );
    data.compressionRatios.gamma = getRounding( Math.sqrt( gamma ) );
  }

  function checkSufficientCondition( data ) {
    const { alpha, betta, gamma } = data.compressionRatios;
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

  function getFormulaAndLeast( data ) {
    const { alpha, betta, gamma } = data.compressionRatios;
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
      data.compressionRatios[ 'least' ] = least;

      return getFormula( data, least );
    }
  }

  function getFormula( data, least ){
    switch( least ){
      case 'alpha': 
        return ( roMax, ros ) => {
          const { alpha } = data.compressionRatios;
          return ( alpha / ( 1 - alpha ) ) * roMax;
        }

      case 'betta':
        return ( roMax, ros ) => {
          const { betta } = data.compressionRatios;
          let roSum = 0;
          ros.forEach( ro => roSum += ro );
          return ( betta / ( 1 - betta ) ) * roSum;
        }

      case 'gamma': 
        return ( roMax, ros ) => {
          const { gamma } = data.compressionRatios;
          let roSum = 0;
          ros.forEach( ro => roSum += ro * ro );
          return ( gamma / ( 1 - gamma ) ) * Math.sqrt( roSum );
        } 

      default: {}
    }
  }

  function populateEquations( data ) {
    const keys = Object.keys( matrix.value );
    keys.forEach( key => { 
      const line      = matrix.value[ key ][ 'line' ];
      const lineKeys  = Object.keys( line );
      const MDN       = matrix.mainDiagonal[ key ]; // mainDiagonalNumber
      const equationValues  = [];

      lineKeys.forEach( keyItem => {
        const item = line[ keyItem ];
        if( key !== keyItem ){
          let value = null;
          if( keyItem < lineKeys.length - 1 ) {
            value = item > 0 ? ( item / MDN ) * ( -1 ) : Math.abs( item ) / MDN;
          } else {
            value = item / MDN;
          }
          equationValues.push( getRounding( value ) );
        } else if( key === keyItem  ){
          equationValues.push( 0 );
        }
      } )
      data.mainEquations[ `x${ key }` ] = equationValues;
    } );
  }

  function populateIterations( data ) {
    populateIteration( data );
    populateIteration( data );
    while( getAccuracy( data ) > E ){
      populateIteration( data );
    }
  }

  function populateIteration( data ){
    const keys            = Object.keys( matrix.value );
    const iterationNumber = getIterationNumber( data );
    data.iterations[ iterationNumber ] = {}
    keys.forEach( key => { 
      const equation = data.mainEquations[ `x${ key }` ];
      let result     = 0;
      equation.forEach( ( number, index ) => {
        if( index === equation.length - 1 ) {
          result += number;
        } else {
          if( iterationNumber === 0  ) {
            result += number * 0;
          } else if( iterationNumber > 0 ) {
            const x = data.iterations[ iterationNumber - 1 ][ `x${ index }` ];
            result += number * x;
          }  
        }
      } )
      data.iterations[ iterationNumber ][ `x${ key }` ] = getRounding( result );
    } );
  }

  function getIterationNumber( data ) {
    const keys = Object.keys( data.iterations );
    return keys.length ? keys.length : 0;
  }

  function getAccuracy( data ) {
    const keys                  = Object.keys( data.iterations );
    const iterationLast         = data.iterations[ keys.length - 1 ];
    const iterationPenultimate  = data.iterations[ keys.length - 2 ];

    if( keys.length > 1 ){
      const { ros, roMax } = populateRosAndRoMax( iterationLast, iterationPenultimate );
      const formula  = getFormulaAndLeast( data );
      const accuracy = getRounding( formula( roMax, ros ) );
      iterationLast[ 'accuracy' ] = accuracy;
      return accuracy;
    }
  }

  function populateRosAndRoMax( iterationLast, iterationPenultimate ){
    const keys = Object.keys( matrix.value );
    const ros  = [];
    let roMax  = 0;
    keys.forEach( matrixKey => {
      const ro      = iterationPenultimate[ `x${ matrixKey }` ] - iterationLast[ `x${ matrixKey }` ];
      const roRound = getRounding( ro )
      roMax = roMax > Math.abs( roRound ) ? roMax : Math.abs( roRound );
      ros.push( Math.abs( roRound ) )
    } )
    iterationLast[ 'roMax' ]  = roMax;
    iterationLast[ 'ros' ]    = ros;

    return { ros, roMax };
  }

  function getRounding( number ) {
    return Number( number.toFixed( 5 ) );
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
        { Object.keys( matrix.value ).length >= 1 && <button onClick={ () => handlerOnClickSandData() }>Send data</button> }

        <MainEquations mainEquations={ mainData.mainEquations }/>
        <CompressionRatios compressionRatios={ mainData.compressionRatios }/>
        <Decision iterations={ mainData.iterations } />
        <ResidualVector matrix={ matrix.value } iterations={ mainData.iterations } />
      
      </div>
    </Context.Provider>
  );
}

export default App;
