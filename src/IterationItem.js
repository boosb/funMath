import React from 'react';
import './IterationItem.css';


function IterationItem( props ) {

  if( props.iterationItemKey !== 'ro' ){
    return (
        <div className='iteration-item-wrapper'>
            <div className='iteration-item-x-box'>
                <span className='iteration-item-x'>X</span>
                <span className='iteration-item-index'>{ props.index + 1 }</span>
                <span className='iteration-index'>{ props.iterationKey }</span>
            </div>
            <div>&nbsp; = &nbsp;</div>
            <div>{ props.number }</div>
        </div>
      )
  }
}

export default IterationItem;