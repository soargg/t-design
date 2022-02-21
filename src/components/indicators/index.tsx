import React from 'react';
import { ElasticDots } from './elastic_dots';
import { ScaleDots } from './scale_dots';

type IndicatorsProps = {
    total: number;
    index: number;
    type?: 'scale' | 'elastic';
}

const Indicators = React.forwardRef((props: IndicatorsProps, ref: any) => {
    const { type = 'scale', index, total } = props;
    if ( type === 'scale' ) {
        return <ScaleDots ref={ref} curPage={index} maxPage={total} activeDotColor='#ffffff'/>
    }

    return <ElasticDots ref={ref} index={index} total={total}/>
});


export default Indicators;