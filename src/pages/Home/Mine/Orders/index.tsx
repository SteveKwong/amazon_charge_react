import React, { useState } from "react";
import {Breadcrumb, Card, Col, Row, Statistic, Typography, Button, Space, Table, Tag, Modal} from "antd";
import DashboardSection from "@/components/DashboardSection";

const { Title, Paragraph } = Typography;

const MyOrdersPage: React.FC = () => {
    const [detailItem, setDetailItem] = useState<any>(null);

    const handleViewDetail = (record: any) => {
        setDetailItem(record);
    };

    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '我的' },
                { title: '我的接单' },
            ]} />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card 
                        bordered={false} 
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic 
                            title="今日新单" 
                            value={12} 
                            suffix="单"
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                        />
                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                            今日新单
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card 
                        bordered={false} 
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic 
                            title="进行中" 
                            value={5} 
                            suffix="单"
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                        />
                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                            进行中
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card 
                        bordered={false} 
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
                        }}
                        bodyStyle={{ padding: '20px' }}
                    >
                        <Statistic 
                            title="已完成" 
                            value={36} 
                            suffix="单"
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                        />
                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                            已完成
                        </div>
                    </Card>
                </Col>
            </Row>

            <DashboardSection
                style={{marginTop: 16}}
                title="订单列表"
                description="最近接单概览"
                extra={<Button>导出</Button>}
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
                        {
                            title: '操作',
                            key: 'action',
                            render: (_, record) => (
                                <Space>
                                    <Button 
                                        size="small" 
                                        type="primary" 
                                        ghost 
                                        onClick={() => handleViewDetail(record)}
                                    >
                                        详细
                                    </Button>
                                </Space>
                            )
                        },
                    ]}
                    dataSource={[
                        { id: 'A1001', customer: '张三', amount: 120, status: '进行中', createdAt: '2025-08-20 10:20' },
                        { id: 'A1002', customer: '李四', amount: 80, status: '已完成', createdAt: '2025-08-19 09:12' },
                        { id: 'A1003', customer: '王五', amount: 220, status: '进行中', createdAt: '2025-08-18 14:30' },
                        { id: 'A1004', customer: '赵六', amount: 150, status: '已完成', createdAt: '2025-08-17 16:02' },
                    ]}
                />
            </DashboardSection>

            {/* 订单详情Modal */}
            <Modal
                open={!!detailItem}
                onCancel={() => setDetailItem(null)}
                title="订单详情"
                footer={<Button onClick={() => setDetailItem(null)}>关闭</Button>}
                centered
                width={640}
            >
                {detailItem && (
                    <div style={{ padding: '16px 0' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>订单号：</div>
                                <div>{detailItem.id}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>客户：</div>
                                <div>{detailItem.customer}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>金额：</div>
                                <div>¥{detailItem.amount}</div>
                            </Col>
                            <Col span={12}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>状态：</div>
                                <div>
                                    <Tag color={detailItem.status==='进行中'?'blue': detailItem.status==='已完成'?'green':'default'}>
                                        {detailItem.status}
                                    </Tag>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div style={{ fontWeight: 600, marginBottom: 8 }}>创建时间：</div>
                                <div>{detailItem.createdAt}</div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default MyOrdersPage;


