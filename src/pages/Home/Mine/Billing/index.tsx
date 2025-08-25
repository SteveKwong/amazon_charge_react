import React from "react";
import {Breadcrumb, Card, Typography} from "antd";
import RightActionBar from "@/components/RightActionBar";

const { Title, Paragraph } = Typography;

const MyBillingPage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '我的' },
                { title: '我的账单' },
            ]} />
            <Card bordered>
                <Title level={4}>我的账单</Title>
                <Paragraph>展示账单列表、支付记录与余额（占位）。</Paragraph>
            </Card>
            <RightActionBar
                style={{ left: 12, bottom: 12, right: 'auto', top: 'auto' }}
            />
        </>
    );
};

export default MyBillingPage;


