import React from 'react';

function Accuracy( props ) {
    const { accuracy } = props.iteration;
    
    if( accuracy ){
        return (
            <div>
                <span>{ props.iterationKey } &nbsp; - &nbsp; </span>
                <span>{ accuracy }</span>
            </div>
        )
    }

}

export default Accuracy;