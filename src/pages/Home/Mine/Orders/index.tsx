import React from "react";
import {Breadcrumb, Card, Col, Row, Statistic, Typography, Button, Space, Table, Tag} from "antd";
import DashboardSection from "@/components/DashboardSection";

const { Title, Paragraph } = Typography;

const MyOrdersPage: React.FC = () => {
    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '我的' },
                { title: '我的接单' },
            ]} />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{borderRadius: 12}}>
                        <Statistic title="今日新单" value={12} suffix="单" />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{borderRadius: 12}}>
                        <Statistic title="进行中" value={5} suffix="单" />
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{borderRadius: 12}}>
                        <Statistic title="已完成" value={36} suffix="单" />
                    </Card>
                </Col>
            </Row>

            <DashboardSection
                style={{marginTop: 16}}
                title="订单列表"
                description="最近接单概览"
                extra={<Space><Button>导出</Button><Button type="primary">新建</Button></Space>}
            >
                <Table
                    rowKey="id"
                    pagination={{pageSize: 8, showSizeChanger: false}}
                    columns={[
                        { title: '订单号', dataIndex: 'id' },
                        { title: '客户', dataIndex: 'customer' },
                        { title: '金额', dataIndex: 'amount', render: (v) => `¥${v}` },
                        { title: '状态', dataIndex: 'status', render: (s) => <Tag color={s==='进行中'?'blue': s==='已完成'?'green':'default'}>{s}</Tag> },
                        { title: '创建时间', dataIndex: 'createdAt' },
                    ]}
                    dataSource={[
                        { id: 'A1001', customer: '张三', amount: 120, status: '进行中', createdAt: '2025-08-20 10:20' },
                        { id: 'A1002', customer: '李四', amount: 80, status: '已完成', createdAt: '2025-08-19 09:12' },
                        { id: 'A1003', customer: '王五', amount: 220, status: '进行中', createdAt: '2025-08-18 14:30' },
                        { id: 'A1004', customer: '赵六', amount: 150, status: '已完成', createdAt: '2025-08-17 16:02' },
                    ]}
                />
            </DashboardSection>
        </>
    );
};

export default MyOrdersPage;


