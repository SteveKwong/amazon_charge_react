import React from 'react';
import {Footer} from "antd/lib/layout/layout";

interface BackgroundProps {
    children?: React.ReactNode;
}

const MyFooter: React.FC<BackgroundProps> = () => {

    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'black',
        fontSize: '12px', // 设置字体大小，让文字更紧凑
        padding: '10px 0', // 设置上下内边距使其更窄
    };

    return (
        <div >
            <Footer style={footerStyle}>All Rights Reserved, Copyright(c),MicroSoft
            </Footer>
        </div>
    );
};

export default MyFooter;
