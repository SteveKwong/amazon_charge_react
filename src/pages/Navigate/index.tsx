import React from 'react';
import {Layout, Menu} from 'antd';
import './index.scss'; // 用于定义样式
import logo from '@/components/icon.png';


const {Header} = Layout;

/**
 * 导航页面
 * @constructor
 */
const Navigate: React.FC = () => {
    return (
        <div className="header-container">
            <Header className="site-header">
                <div className="logo">
                    <img src={logo} alt="Logo" className="logo-image"/>
                </div>
                <div className="account-number">
                    {'客服热线：139-6401-4229'}
                </div>
            </Header>
        </div>
    );
};

export default Navigate;
