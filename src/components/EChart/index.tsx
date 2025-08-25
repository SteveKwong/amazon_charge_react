import React from 'react';
import ReactECharts from 'echarts-for-react';

type EChartProps = {
    option: any;
    style?: React.CSSProperties;
    className?: string;
};

const EChart: React.FC<EChartProps> = ({ option, style, className }) => {
    return (
        <ReactECharts option={option} style={style} className={className} notMerge lazyUpdate />
    );
};

export default EChart;


