import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotExist: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/login');  // 跳转到登录页面
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="抱歉,您访问的地址有误"
            extra={<Button type="primary" onClick={handleBackToLogin}>回到登录页</Button>}
        />
    );
};

export default NotExist;
