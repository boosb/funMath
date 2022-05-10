import React, { useContext } from 'react';
import Context from '../../../Context'
import './Item.css';


function Item( props ) {
  const { populateItem } = useContext( Context );

  return (
    <span>
        { props.lastItem && "= " }
        <input className='item-input' onChange={ event => populateItem( event.target.value, props.lineId, props.itemId ) }></input>
        { !props.lastItem && <span className='item-text'>x{ props.itemId + 1 }</span> }
    </span>
  )
}

export default Item;