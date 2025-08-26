import React from "react";
import {Button, Card, Result, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

const DegradedPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPath = (location.state as any)?.from as string | undefined;

    return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Card style={{width: 520}}>
                <Result
                    status="warning"
                    title="未检测到登录状态"
                    subTitle={`您访问的页面需要登录权限。${fromPath ? `来源路径：${fromPath}` : ''}`}
                    extra={[
                        <Button type="primary" key="login" onClick={() => navigate('/login', { replace: true })}>
                            去登录
                        </Button>,
                        <Button key="home" onClick={() => navigate('/', { replace: true })}>返回首页</Button>
                    ]}
                />
                <Typography.Paragraph type="secondary" style={{textAlign: 'center'}}>
                    登录后将自动恢复访问权限。
                </Typography.Paragraph>
            </Card>
        </div>
    );
};

export default DegradedPage;





