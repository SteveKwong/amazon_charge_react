import React from "react";
import {Breadcrumb, Card, Typography} from "antd";

const { Title, Paragraph } = Typography;

const MyProfilePage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '我的' },
                { title: '个人信息' },
            ]} />
            <Card bordered>
                <Title level={4}>个人信息</Title>
                <Paragraph>展示与编辑个人资料（占位）。</Paragraph>
            </Card>
        </>
    );
};

export default MyProfilePage;



