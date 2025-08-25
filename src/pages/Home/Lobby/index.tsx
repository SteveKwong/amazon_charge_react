import React from "react";
import {Breadcrumb, Card, Typography} from "antd";

const { Title, Paragraph } = Typography;

const LobbyPage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '接单大厅' },
            ]} />
            <Card bordered>
                <Title level={4}>大厅</Title>
                <Paragraph>欢迎来到大厅页面。这里可以放置公告、快捷入口等。</Paragraph>
            </Card>
        </>
    );
};

export default LobbyPage;


