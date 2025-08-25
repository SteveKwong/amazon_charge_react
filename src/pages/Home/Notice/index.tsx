import React from "react";
import {Breadcrumb, Card, Typography} from "antd";

const { Title, Paragraph } = Typography;

const NoticePage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '公告' },
            ]} />
            <Card bordered>
                <Title level={4}>公告</Title>
                <Paragraph>这里展示平台公告、通知与更新日志。</Paragraph>
            </Card>
        </>
    );
};

export default NoticePage;


