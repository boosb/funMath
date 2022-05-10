import React from 'react';
import './CompressionRatios.css';

function CompressionRatios( props ) {
  const { alpha, betta, gamma, least } = props.compressionRatios;
  {
      if( alpha > 0 || betta > 0 || gamma > 0  ){
        return (
            <div>
                <h3>Compression ratios</h3>
                <div className='compression-ratios-wrapper' >
                    <div className={ `compression-ratio-item ${ least === 'alpha' ? 'good-item' : '' }` }>
                        <span className='compression-ratio-name'>&#945;</span>
                        <span>&nbsp;=&nbsp;</span>
                        <span>{ alpha }</span>
                    </div>
                    <div className={ `compression-ratio-item ${ least === 'betta' ? 'good-item' : '' }` }>
                        <span className='compression-ratio-name'>&#946;</span>
                        <span>&nbsp;=&nbsp;</span>
                        <span>{ betta }</span>
                    </div>
                    <div className={ `compression-ratio-item ${ least === 'gamma' ? 'good-item' : '' }` }>
                        <span className='compression-ratio-name'>&#947;</span>
                        <span>&nbsp;=&nbsp;</span>
                        <span>{ gamma }</span>
                    </div>
                </div>
            </div>
        )
      }
  }
}

export default CompressionRatios;