import React, {useEffect, useMemo, useState} from "react";
import {Avatar, Button, Dropdown, Layout, Menu, Space, Typography} from "antd";
import { ClockCircleOutlined, AppstoreOutlined, NotificationOutlined, ShoppingOutlined, BarChartOutlined, UserOutlined, FileTextOutlined, ProfileOutlined, CreditCardOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import RightActionBar from "@/components/RightActionBar";
import VipTag from "@/components/VipTag";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import companyIcon from "@/components/icon.png";
import { getRequest } from "@/components/network/api";

const { Header, Sider, Content } = Layout;

// 用户信息接口
interface UserInfo {
    nickname: string;
    icon_url: string;
    member?: boolean; // 会员状态字段，对应接口返回的member
}

const HomeLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userInfoLoading, setUserInfoLoading] = useState(false);

    const selectedKeys = useMemo(() => {
        if (location.pathname.startsWith("/home/order-hall/notice")) return ["order-hall:notice"];
        if (location.pathname.startsWith("/home/order-hall/lobby")) return ["order-hall:lobby"];
        if (location.pathname.startsWith("/home/order-hall/sales")) return ["order-hall:sales"];
        if (location.pathname.startsWith("/home/mine/orders")) return ["mine:orders"];
        if (location.pathname.startsWith("/home/mine/profile")) return ["mine:profile"];
        if (location.pathname.startsWith("/home/mine/billing")) return ["mine:billing"];
        return ["order-hall:notice"]; // 默认选中公告
    }, [location.pathname]);
    const defaultOpenKeys = useMemo(() => {
        if (location.pathname.startsWith("/home/order-hall/")) return ["order-hall"];
        if (location.pathname.startsWith("/home/mine/")) return ["mine"];
        return [] as string[];
    }, [location.pathname]);

    const [nowText, setNowText] = useState<string>(dayjs().format('YYYY-MM-DD HH:mm:ss'));
    
    // 测试头像URL是否有效
    const testImageUrl = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    // 获取用户信息
    const fetchUserInfo = async () => {
        try {
            setUserInfoLoading(true);
            const response = await getRequest("user/getNicknameAndPicture", {}, true);
            
            console.log('用户信息响应:', response);
            
            if (response?.code === 200 && response?.data) {
                const userData = response.data;
                console.log('设置用户信息:', userData);
                
                // 测试头像URL是否有效
                if (userData.icon_url) {
                    const isValidUrl = await testImageUrl(userData.icon_url);
                    console.log('头像URL是否有效:', isValidUrl, userData.icon_url);
                }
                
                setUserInfo(userData); // 直接使用接口返回的数据，包含member字段
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
        } finally {
            setUserInfoLoading(false);
        }
    };
    
    useEffect(() => {
        const timer = setInterval(() => {
            setNowText(dayjs().format('YYYY-MM-DD HH:mm:ss'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    
    // 页面加载时获取用户信息
    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 阻止从 Home 直接后退到登录或外部：进入时 push 一层哨兵状态，回退时再 push 回来
    useEffect(() => {
        const guard = () => {
            const token = localStorage.getItem('token');
            if (token) {
                // 若历史深度极浅（通常回退将离开本应用，例如退到空白/新标签页），清空登录态
                try {
                    if (window.history.length <= 2) {
                        localStorage.removeItem('token');
                    }
                } catch {}
                // 吃掉这次返回，保持停留在 Home
                window.history.pushState(null, '', window.location.href);
            }
        };
        // 首次进入时先压入一层，避免回退越过当前页
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', guard);
        return () => window.removeEventListener('popstate', guard);
    }, []);

    // 扁平化菜单项（当折叠时）
    const getFlatMenuItems = () => {
        if (!collapsed) {
            return [
                {
                    key: 'order-hall',
                    label: '大厅',
                    icon: <AppstoreOutlined />,
                    children: [
                        { key: 'order-hall:notice', label: '公告', icon: <NotificationOutlined /> },
                        { key: 'order-hall:lobby', label: '接单大厅', icon: <ShoppingOutlined /> },
                        { key: 'order-hall:sales', label: '销量展示', icon: <BarChartOutlined /> },
                    ],
                },
                {
                    key: 'mine',
                    label: '我的',
                    icon: <UserOutlined />,
                    children: [
                        { key: 'mine:orders', label: '我的接单', icon: <FileTextOutlined /> },
                        { key: 'mine:profile', label: '个人信息', icon: <ProfileOutlined /> },
                        { key: 'mine:billing', label: '我的账单', icon: <CreditCardOutlined /> },
                    ],
                },
            ];
        } else {
            // 扁平化显示，只显示图标
            return [
                { key: 'order-hall:notice', label: '', icon: <NotificationOutlined />, title: '公告' },
                { key: 'order-hall:lobby', label: '', icon: <ShoppingOutlined />, title: '接单大厅' },
                { key: 'order-hall:sales', label: '', icon: <BarChartOutlined />, title: '销量展示' },
                { key: 'mine:orders', label: '', icon: <FileTextOutlined />, title: '我的接单' },
                { key: 'mine:profile', label: '', icon: <ProfileOutlined />, title: '个人信息' },
                { key: 'mine:billing', label: '', icon: <CreditCardOutlined />, title: '我的账单' },
            ];
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider 
                width={collapsed ? 80 : 220} 
                theme="light" 
                style={{backgroundColor: '#e3f1f1'}} 
                className="custom-sider"
                collapsed={collapsed}
                collapsedWidth={80}
            >
                <div style={{
                    height: 48, 
                    margin: 16, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'flex-start'
                }}>
                    <img 
                        src={companyIcon} 
                        alt="公司Logo" 
                        style={{
                            height: collapsed ? '32px' : '40px',
                            width: collapsed ? '32px' : 'auto',
                            objectFit: 'contain'
                        }}
                    />
                </div>
                
                {/* 缩放按钮 */}
                <div style={{
                    padding: '0 16px 16px 16px',
                    textAlign: collapsed ? 'center' : 'right'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            color: '#666',
                            border: 'none',
                            background: 'transparent'
                        }}
                        title={collapsed ? '展开' : '收起'}
                    />
                </div>

                <Menu
                    theme="light"
                    mode="inline"
                    defaultOpenKeys={collapsed ? [] : defaultOpenKeys}
                    selectedKeys={selectedKeys}
                    onClick={(info) => {
                        if (info.key === 'order-hall:notice') navigate('/home/order-hall/notice');
                        if (info.key === 'order-hall:lobby') navigate('/home/order-hall/lobby');
                        if (info.key === 'order-hall:sales') navigate('/home/order-hall/sales');
                        if (info.key === 'mine:orders') navigate('/home/mine/orders');
                        if (info.key === 'mine:profile') navigate('/home/mine/profile');
                        if (info.key === 'mine:billing') navigate('/home/mine/billing');
                    }}
                    items={getFlatMenuItems()}
                    style={{backgroundColor: '#e3f1f1'}}
                    className="fun-menu"
                    inlineCollapsed={collapsed}
                />
            </Sider>
            <Layout>
                <Header style={{
                    background: '#fff', 
                    padding: '0 16px', 
                    borderBottom: '1px solid #e5e5e5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    minHeight: '64px'
                }}>
                    <Typography.Text style={{fontSize: 16, fontWeight: 600}}/>
                    <Space size={16}>
                        <Button
                            icon={<ClockCircleOutlined />}
                            type="default"
                            shape="round"
                            style={{
                                background: '#f5f5f5',
                                borderColor: '#f0f0f0',
                                color: '#000',
                                boxShadow: 'none'
                            }}
                        >
                            {nowText}
                        </Button>
                        
                        <div 
                            style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '6px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'rgba(248, 249, 250, 0.6)',
                                border: '1px solid rgba(222, 226, 230, 0.3)',
                                transition: 'all 0.3s ease',
                                marginBottom: '4px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(248, 249, 250, 0.9)';
                                e.currentTarget.style.border = '1px solid rgba(222, 226, 230, 0.6)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(248, 249, 250, 0.6)';
                                e.currentTarget.style.border = '1px solid rgba(222, 226, 230, 0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: 'settings', label: '设置' },
                                        { type: 'divider' as const },
                                        { key: 'logout', label: '退出登录' },
                                    ],
                                    onClick: (info) => {
                                        if (info.key === 'settings') {
                                            navigate('/home/settings');
                                        }
                                        if (info.key === 'logout') {
                                            try { localStorage.removeItem('token'); } catch {}
                                            navigate('/login', { replace: true });
                                        }
                                    },
                                }}
                                trigger={["click"]}
                            >
                                <Space style={{cursor: 'pointer'}}>
                                    <Avatar 
                                        size={32} 
                                        src={userInfo?.icon_url}
                                        style={{backgroundColor: '#1677ff'}}
                                        onError={() => {
                                            console.log('头像加载失败，使用默认头像');
                                            return false;
                                        }}
                                    >
                                        {userInfo?.nickname?.charAt(0) || 'U'}
                                    </Avatar>
                                    <Typography.Text style={{ fontSize: '14px', fontWeight: '500' }}>
                                        {userInfoLoading ? '加载中...' : (userInfo?.nickname || 'Profile')}
                                    </Typography.Text>
                                </Space>
                            </Dropdown>
                            
                            {/* PLUS标签放在用户名和头像下方 */}
                            <VipTag isVip={userInfo?.member || false} />
                        </div>
                    </Space>
                </Header>
                <Content style={{margin: 16, background: '#fff', padding: 16}}>
                    <Outlet />
                </Content>
                <RightActionBar />
            </Layout>
            <style>{`
              .custom-sider .ant-menu {
                background-color: #e3f1f1 !important;
              }
              .custom-sider .ant-menu-item {
                color: #8c8c8c !important; /* 未选中为灰色 */
                font-family: 'Comic Sans MS', 'Baloo 2', cursive, system-ui; /* 卡通化字体 */
                position: relative;
                overflow: hidden;
              }
              .custom-sider .ant-menu-item:hover {
                color: #000000 !important;
                background-color: rgba(0,0,0,0.03) !important;
              }
              .custom-sider .ant-menu-item-selected {
                color: #000000 !important; /* 选中为黑色 */
                background-color: #fff6e6 !important; /* 与其他不同的选中背景色（浅橙） */
                font-weight: 600;
              }
              .custom-sider .ant-menu-item-selected::after {
                border-right: none !important; /* 去掉默认高亮边条 */
              }

              /* 折叠状态下的样式 */
              .custom-sider.ant-layout-sider-collapsed .ant-menu-item {
                text-align: center;
                padding: 0 !important;
              }
              
              .custom-sider.ant-layout-sider-collapsed .ant-menu-item .anticon {
                font-size: 18px;
                margin: 0 !important;
              }

              /* 点击水纹波浪效果 */
              .fun-menu .ant-menu-item:active::after {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0) 60%);
                animation: ripple .45s ease-out forwards;
              }
              @keyframes ripple {
                from { width: 0; height: 0; opacity: 0.6; }
                to   { width: 220px; height: 220px; opacity: 0; }
              }
              
              /* 折叠状态下的水纹效果调整 */
              .custom-sider.ant-layout-sider-collapsed .fun-menu .ant-menu-item:active::after {
                animation: ripple-collapsed .45s ease-out forwards;
              }
              @keyframes ripple-collapsed {
                from { width: 0; height: 0; opacity: 0.6; }
                to   { width: 80px; height: 80px; opacity: 0; }
              }
            `}</style>
        </Layout>
    );
};

export default HomeLayout;


