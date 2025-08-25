import React from "react";
import {Breadcrumb, Card, Typography} from "antd";

const { Title, Paragraph } = Typography;

const SalesPage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '销量展示' },
            ]} />
            <Card bordered>
                <Title level={4}>销量展示</Title>
                <Paragraph>在此展示销量相关图表与统计数据（占位）。</Paragraph>
            </Card>
        </>
    );
};

export default SalesPage;



