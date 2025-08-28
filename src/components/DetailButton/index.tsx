import React from 'react';
import { Button } from 'antd';
import './index.scss';

interface DetailButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const DetailButton: React.FC<DetailButtonProps> = ({ 
    onClick, 
    children = '详情', 
    className = '', 
    style = {} 
}) => {
    return (
        <Button 
            size="middle" 
            type="primary" 
            ghost 
            onClick={onClick}
            className={`detail-button ${className}`}
            style={style}
        >
            {children}
        </Button>
    );
};

export default DetailButton;
