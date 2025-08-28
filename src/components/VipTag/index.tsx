import React from 'react';
import './index.scss';

interface VipTagProps {
    isVip: boolean;
    className?: string;
    style?: React.CSSProperties;
}

const VipTag: React.FC<VipTagProps> = ({ isVip, className, style }) => {
    return (
        <div 
            className={`vip-tag ${isVip ? 'vip' : 'non-vip'} ${className || ''}`}
            style={style}
        >
            <span className="tag-text">
                PLUS
            </span>
        </div>
    );
};

export default VipTag;
