import React, {useEffect, useMemo, useState} from "react";
import {Breadcrumb, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message, Statistic} from "antd";
import DashboardSection from "@/components/DashboardSection";
import {getRequest, postRequest} from "@/components/network/api";
import './index.scss';
import EChart from "@/components/EChart";

const { Title } = Typography;

type JobTask = {
    id: string | number;
    title?: string;
    jobType?: string;
    city?: string;
    hrBonus?: number | string;
    serviceFee?: number | string;
    createdAt?: string;
    status?: string;
    [key: string]: any;
};

type PageResp = {
    content: JobTask[];
    totalElements: number;
};

const LobbyPage: React.FC = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState<JobTask[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1); // antd 1-based
    const [pageSize, setPageSize] = useState<number>(10);
    const [cities, setCities] = useState<string[]>([]);
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [detailItem, setDetailItem] = useState<JobTask | null>(null);
    // 假数据（可替换为真实汇总接口）
    const totalOrders = 6790;
    const canceledOrders = 1230;
    const totalAmount = 268000; // 接单金额（示例）
    const availableQuota = 186; // 可接单数量
    const quotaTotal = 500; // 总额度

    const initialQuery = useMemo(() => ({
        title: "",
        jobType: "",
        city: "",
        sortHrBonus: "",
        sortServiceFee: "",
    }), []);

    const fetchOptions = async () => {
        try {
            const [cityResp, typeResp] = await Promise.all([
                getRequest("/jobTask/distinct-city", {}, true),
                getRequest("/jobTask/distinct-titles", {}, true),
            ]);
            const cityData = cityResp?.data ?? cityResp?.result ?? cityResp;
            const typeData = typeResp?.data ?? typeResp?.result ?? typeResp;
            setCities(Array.isArray(cityData) ? cityData : (cityData?.list || []));
            setJobTypes(Array.isArray(typeData) ? typeData : (typeData?.list || []));
        } catch (_) {
            // 忽略，保持为空
        }
    };

    const fetchPage = async (q?: Partial<typeof initialQuery>, p: number = page, s: number = pageSize) => {
        setLoading(true);
        try {
            const values = form.getFieldsValue();
            const payload = {
                page: Math.max(0, p - 1),
                size: s,
                title: values.title ?? initialQuery.title,
                jobType: values.jobType ?? initialQuery.jobType,
                city: values.city ?? initialQuery.city,
                sortHrBonus: values.sortHrBonus ?? initialQuery.sortHrBonus,
                sortServiceFee: values.sortServiceFee ?? initialQuery.sortServiceFee,
                ...q,
            };
            const resp = await postRequest("/jobTask/page", payload, true);
            const dataNode = resp?.data ?? resp?.result ?? resp;
            const listRaw = dataNode?.list ?? dataNode?.content ?? [];
            const transformed: JobTask[] = listRaw.map((it: any) => ({
                id: it.id,
                title: it.title,
                jobType: it.job_type ?? it.jobType,
                city: it.city,
                hrBonus: it.hr_bonus ?? it.hrBonus,
                serviceFee: it.service_fee ?? it.serviceFee,
                createdAt: it.created_at ?? it.createdAt,
                status: it.status,
                accepted: it.accepted,
                raw: it,
            }));
            const totalElements: number = dataNode?.total_count ?? dataNode?.totalElements ?? transformed.length;
            const nextPage: number = dataNode?.curr_page ?? p;
            const nextSize: number = dataNode?.page_size ?? s;
            // 仅展示未接单（若后端未过滤，尝试用 status/accepted 字段进行前端过滤）
            const filtered = transformed.filter(item => {
                if (typeof item.accepted !== 'undefined') return !item.accepted;
                if (typeof item.status === 'string') return !['ACCEPTED', '已接单', '已接纳'].includes(item.status);
                return true;
            });
            setData(filtered);
            setTotal(totalElements);
            setPage(nextPage);
            setPageSize(nextSize);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
        // 初始化查询
        form.setFieldsValue(initialQuery);
        fetchPage(initialQuery, 1, pageSize);
    }, []);

    const acceptOrder = (record: JobTask) => {
        // 仅前端模拟：移除该条并提示
        setData(prev => prev.filter(item => String(item.id) !== String(record.id)));
        message.success('接单成功');
    };

    const columns = [
        { title: '标题', dataIndex: 'title' },
        { title: '岗位', dataIndex: 'jobType' },
        { title: '城市', dataIndex: 'city' },
        { title: 'HR奖励', dataIndex: 'hrBonus', render: (v: any) => v ? `¥${v}` : '-' },
        { title: '服务费', dataIndex: 'serviceFee', render: (v: any) => v ? `¥${v}` : '-' },
        { title: '状态', dataIndex: 'status', render: (s: any) => <Tag color={s==='已接单' || s==='ACCEPTED' ? 'default' : 'blue'}>{s || '待接单'}</Tag> },
        {
            title: '一键接单',
            key: 'quickAccept',
            render: (_: any, record: JobTask) => (
                <Button type="primary" danger size="small" onClick={() => acceptOrder(record)}>一键接单</Button>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: JobTask) => (
                <Space>
                    <Button size="small" type="primary" ghost className="detail-btn" onClick={() => setDetailItem(record)}>详细</Button>
                </Space>
            )
        },
    ];

    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '接单大厅' },
            ]} />

            <Row gutter={[16,16]}>
                <Col xs={24}>
                    <Row gutter={[16,16]}>
                        <Col xs={24} sm={12} md={6}>
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
                                    title="总接单数" 
                                    value={totalOrders} 
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    总接单数
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Card 
                                bordered={false} 
                                style={{
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <Statistic 
                                    title="取消接单数" 
                                    value={canceledOrders} 
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    取消接单数
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
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
                                    title="接单金额(¥)" 
                                    value={totalAmount} 
                                    precision={0}
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    接单金额(¥)
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
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
                                    title="可接单数/总额" 
                                    value={`${availableQuota}/${quotaTotal}`} 
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    可接单数/总额
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col span={24}>
                    <Card 
                        bordered={false} 
                        style={{
                            borderRadius: 12,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        title={
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 8,
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#262626'
                            }}>
                                <span>🔍</span>
                                <span>筛选条件</span>
                            </div>
                        }
                    >
                        <Form 
                            layout="vertical" 
                            form={form} 
                            onFinish={() => { setPage(1); fetchPage(undefined, 1, pageSize); }}
                            style={{ marginTop: 8 }}
                        >
                            <Row gutter={[24, 16]}>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label="标题关键词" 
                                        name="title"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Input 
                                            allowClear 
                                            placeholder="输入关键词搜索" 
                                            style={{ 
                                                borderRadius: 8,
                                                border: '1px solid #d9d9d9'
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label="岗位类型" 
                                        name="jobType"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select 
                                            allowClear 
                                            placeholder="选择岗位类型"
                                            style={{ 
                                                borderRadius: 8,
                                                border: '1px solid #d9d9d9'
                                            }}
                                            options={jobTypes.map(j => ({ value: j, label: j }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label="城市地区" 
                                        name="city"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select 
                                            allowClear 
                                            placeholder="选择城市地区"
                                            style={{ 
                                                borderRadius: 8,
                                                border: '1px solid #d9d9d9'
                                            }}
                                            options={cities.map(c => ({ value: c, label: c }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label="HR奖励排序" 
                                        name="sortHrBonus"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select 
                                            allowClear 
                                            placeholder="选择排序方式"
                                            style={{ 
                                                borderRadius: 8,
                                                border: '1px solid #d9d9d9'
                                            }}
                                            options={[
                                                {value:'asc', label:'升序 (低→高)'},
                                                {value:'desc', label:'降序 (高→低)'}
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label="服务费排序" 
                                        name="sortServiceFee"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Select 
                                            allowClear 
                                            placeholder="选择排序方式"
                                            style={{ 
                                                borderRadius: 8,
                                                border: '1px solid #d9d9d9'
                                            }}
                                            options={[
                                                {value:'asc', label:'升序 (低→高)'},
                                                {value:'desc', label:'降序 (高→低)'}
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12} md={8} lg={6}>
                                    <Form.Item 
                                        label=" " 
                                        style={{ marginBottom: 0, marginTop: 29 }}
                                    >
                                        <Space size={12}>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit"
                                                style={{
                                                    borderRadius: 8,
                                                    height: 40,
                                                    padding: '0 24px',
                                                    fontWeight: 500,
                                                    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)'
                                                }}
                                            >
                                                查询
                                            </Button>
                                            <Button 
                                                onClick={() => { 
                                                    form.resetFields(); 
                                                    form.setFieldsValue(initialQuery); 
                                                    setPage(1); 
                                                    fetchPage(initialQuery, 1, pageSize); 
                                                }}
                                                style={{
                                                    borderRadius: 8,
                                                    height: 40,
                                                    padding: '0 24px',
                                                    fontWeight: 500,
                                                    border: '1px solid #d9d9d9'
                                                }}
                                            >
                                                重置
                                            </Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>



                <Col span={24}>
                    <DashboardSection
                        style={{marginTop: 0}}
                        title="订单列表"
                        description="仅展示尚未接纳的订单"
                        // 不展示 导出/新建
                    >
                        <Table
                            rowKey={r => String(r.id)}
                            loading={loading}
                            columns={columns as any}
                            dataSource={data}
                            pagination={{
                                current: page,
                                pageSize: pageSize,
                                total: total,
                                showSizeChanger: true,
                                pageSizeOptions: [10, 20, 50],
                                onChange: (p, s) => {
                                    setPage(p);
                                    setPageSize(s);
                                    fetchPage(undefined, p, s);
                                }
                            }}
                        />
                    </DashboardSection>
                </Col>
            </Row>

            <Modal
                open={!!detailItem}
                onCancel={() => setDetailItem(null)}
                title="订单详情"
                footer={<Button onClick={() => setDetailItem(null)}>关闭</Button>}
                centered
                width={640}
            >
                <pre style={{whiteSpace: 'pre-wrap'}}>{JSON.stringify(detailItem, null, 2)}</pre>
            </Modal>
        </>
    );
};

export default LobbyPage;


