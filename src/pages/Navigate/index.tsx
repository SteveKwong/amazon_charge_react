import React from 'react';
import {Layout, Menu} from 'antd';
import './index.scss'; // 用于定义样式
import logo from '../../components/icon2.png';


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
                    {/*<img src='https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/uhfbanner-xboxlogo1?fmt=png-alpha&bfc=off&qlt=11,1' alt="Logo" className="logo-image" />*/}
                    {/*<img src='../../components/icon.png' alt="Logo" className="logo-image" />*/}
                    <img src={logo} alt="Logo" className="logo-image"/>
                </div>
                {/*<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>*/}
                {/*    <Menu.Item key="1" icon={<HomeOutlined />} className="menu-item">*/}
                {/*        首页*/}
                {/*    </Menu.Item>*/}
                {/*    <Menu.Item key="2" icon={<SearchOutlined />} className="menu-item">*/}
                {/*        搜索*/}
                {/*    </Menu.Item>*/}
                {/*    <Menu.Item key="3" icon={<UserOutlined />} className="menu-item">*/}
                {/*        用户*/}
                {/*    </Menu.Item>*/}
                {/*</Menu>*/}
                <div className="account-number">
                    {'客服热线：139-6401-4229'}
                </div>
            </Header>
        </div>
    );
};

export default Navigate;
