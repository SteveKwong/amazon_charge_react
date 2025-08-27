import React, { useState, useEffect } from "react";
import {Breadcrumb, Card, Col, Row, Statistic, Typography, Button, Space, Table, Tag, Spin, message, Form, Input, Select} from "antd";
import DashboardSection from "@/components/DashboardSection";
import { getRequest, postRequest } from "@/components/network/api";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface MyJobData {
    today_job_num: number;
    accepted_job_num: number;
    over_job_num: number;
}

interface OrderItem {
    id: string;
    title: string;
    job_type: string;
    city: string;
    salary: string;
    welfare: string;
    policy_welfare: string;
    hr_bonus: number;
    service_fee: number;
}

interface PageResp {
    total_count: number;
    page_size: number;
    total_page: number;
    curr_page: number;
    list: OrderItem[];
}

const MyOrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [myJobData, setMyJobData] = useState<MyJobData | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // 错误消息防重复显示
    const [lastErrorMessage, setLastErrorMessage] = useState<string>('');
    const [lastErrorTime, setLastErrorTime] = useState<number>(0);
    
    // 统一的错误处理函数
    const showErrorOnce = (errorMessage: string) => {
        const now = Date.now();
        // 如果相同错误消息在3秒内重复出现，则不显示
        if (errorMessage === lastErrorMessage && now - lastErrorTime < 3000) {
            return;
        }
        setLastErrorMessage(errorMessage);
        setLastErrorTime(now);
        message.error(errorMessage);
    };
    
    // 订单列表相关状态
    const [orderList, setOrderList] = useState<OrderItem[]>([]);
    const [orderLoading, setOrderLoading] = useState(false);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);
    const [cities, setCities] = useState<string[]>([]);
    const [jobTypes, setJobTypes] = useState<string[]>([]);

    const initialQuery = {
        title: "",
        jobType: "",
        city: "",
        sortHrBonus: "",
        sortServiceFee: "",
        jobId: "",
    };

    useEffect(() => {
        fetchMyJobData();
        fetchOrderList();
        fetchOptions();
    }, []);

    const fetchMyJobData = async () => {
        try {
            setLoading(true);
            const response = await getRequest("/user/myJobDisplay", {}, true);
            
            if (response?.code === 200 && response?.data) {
                setMyJobData(response.data);
            } else {
                // 当数据为空时，不显示错误消息，只设置默认数据
                if (response?.code === 200) {
                    setMyJobData({
                        today_job_num: 0,
                        accepted_job_num: 0,
                        over_job_num: 0
                    });
                } else {
                    showErrorOnce(response?.msg || '获取接单数据失败');
                }
            }
        } catch (error: any) {
            console.error('获取接单数据失败:', error);
            showErrorOnce('获取接单数据失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const fetchOptions = async () => {
        try {
            const [cityResp, typeResp] = await Promise.all([
                getRequest("/jobTask/distinct-city", {}, true),
                getRequest("/jobTask/distinct-titles", {}, true),
            ]);
            
            // 处理城市数据
            if (cityResp?.code === 200) {
                const cityData = cityResp?.data ?? cityResp?.result ?? cityResp;
                setCities(Array.isArray(cityData) ? cityData : (cityData?.list || []));
            }
            
            // 处理岗位类型数据
            if (typeResp?.code === 200) {
                const typeData = typeResp?.data ?? typeResp?.result ?? typeResp;
                setJobTypes(Array.isArray(typeData) ? typeData : (typeData?.list || []));
            }
        } catch (error: any) {
            console.error('获取选项数据失败:', error);
            // 静默处理错误，不影响主要功能
        }
    };

    const fetchOrderList = async (q?: Partial<typeof initialQuery>, p: number = page, s: number = pageSize) => {
        try {
            setOrderLoading(true);
            const values = form.getFieldsValue();
            const payload = {
                page: p,
                size: s,
                title: values.title ?? initialQuery.title,
                jobType: values.jobType ?? initialQuery.jobType,
                city: values.city ?? initialQuery.city,
                sortHrBonus: values.sortHrBonus ?? initialQuery.sortHrBonus,
                sortServiceFee: values.sortServiceFee ?? initialQuery.sortServiceFee,
                jobId: values.jobId ?? initialQuery.jobId,
                ...q,
            };
            
            const response = await postRequest("/user/page", payload, true);
            if (response?.code === 200 && response?.data) {
                const data = response.data;
                setOrderList(data.list || []);
                setTotal(data.total_count || 0);
                setPage(data.curr_page || p);
                setPageSize(data.page_size || s);
            } else {
                // 当数据为空时，不显示错误消息，只设置空数据
                if (response?.code === 200) {
                    setOrderList([]);
                    setTotal(0);
                    setPage(p);
                    setPageSize(s);
                } else {
                    showErrorOnce(response?.msg || '获取订单列表失败');
                }
            }
        } catch (error: any) {
            console.error('获取订单列表失败:', error);
            showErrorOnce('获取订单列表失败，请重试');
        } finally {
            setOrderLoading(false);
        }
    };

    const handleViewDetail = (record: OrderItem) => {
        navigate(`/home/my-order-detail/${record.id}`);
    };

    const columns = [
        { 
            title: '订单号', 
            dataIndex: 'id',
            render: (id: string) => (
                <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#1890ff' }}>
                    {id}
                </span>
            )
        },
        { title: '工作类型', dataIndex: 'title' },
        { title: '岗位', dataIndex: 'job_type' },
        { title: '城市', dataIndex: 'city' },
        { title: '薪资', dataIndex: 'salary' },
        { title: 'HR奖励', dataIndex: 'hr_bonus', render: (v: number) => v ? `¥${v}` : '-' },
        { title: '服务费', dataIndex: 'service_fee', render: (v: number) => v ? `¥${v}` : '-' },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: OrderItem) => (
                <Space>
                    <Button 
                        size="small" 
                        type="primary" 
                        ghost 
                        onClick={() => handleViewDetail(record)}
                        style={{
                            borderRadius: '6px',
                            border: '1px solid #1890ff',
                            color: '#1890ff',
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(24, 144, 255, 0.1)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(24, 144, 255, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(24, 144, 255, 0.1)';
                        }}
                    >
                        详细
                    </Button>
                </Space>
            )
        },
    ];

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
                flexDirection: 'column'
            }}>
                <Spin size="large" />
                <div style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    color: '#666',
                    marginTop: '16px'
                }}>
                    正在加载接单数据...
                </div>
            </div>
        );
    }

    if (error || !myJobData) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={3} type="danger">{error || '数据加载失败'}</Title>
                <Button type="primary" onClick={fetchMyJobData}>重新加载</Button>
            </div>
        );
    }

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
                            value={myJobData.today_job_num} 
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
                            value={myJobData.accepted_job_num} 
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
                            value={myJobData.over_job_num} 
                            suffix="单"
                            valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                        />
                        <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                            已完成
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 筛选条件 */}
            <Card 
                bordered={false} 
                style={{
                    marginTop: 16,
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
                    onFinish={() => { setPage(1); fetchOrderList(undefined, 1, pageSize); }}
                    style={{ marginTop: 8 }}
                >
                    <Row gutter={[24, 16]}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item 
                                label="工作类型"
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
                                    options={[
                                        { value: '', label: '全部岗位' },
                                        ...jobTypes.map(j => ({ value: j, label: j }))
                                    ]}
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
                                    options={[
                                        { value: '', label: '全部城市' },
                                        ...cities.map(c => ({ value: c, label: c }))
                                    ]}
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
                                        { value: '', label: '不排序' },
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
                                        { value: '', label: '不排序' },
                                        {value:'asc', label:'升序 (低→高)'},
                                        {value:'desc', label:'降序 (高→低)'}
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item 
                                label="订单号" 
                                name="jobId"
                                style={{ marginBottom: 0 }}
                            >
                                <Input 
                                    allowClear 
                                    placeholder="输入订单号搜索" 
                                    style={{ 
                                        borderRadius: 8,
                                        border: '1px solid #d9d9d9'
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    {/* 查询重置按钮行 */}
                    <Row style={{ marginTop: 16 }}>
                        <Col xs={24} style={{ textAlign: 'left' }}>
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
                                    搜索
                                </Button>
                                <Button 
                                    onClick={() => { 
                                        form.resetFields(); 
                                        form.setFieldsValue(initialQuery); 
                                        setPage(1); 
                                        fetchOrderList(initialQuery, 1, pageSize); 
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
                        </Col>
                    </Row>
                </Form>
            </Card>

            <DashboardSection
                style={{marginTop: 16}}
                title="我的接单列表"
                description="我的接单记录"
            >
                <Table
                    rowKey="id"
                    loading={orderLoading}
                    columns={columns}
                    dataSource={orderList}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        pageSizeOptions: [10, 20, 50],
                        onChange: (p, s) => {
                            setPage(p);
                            setPageSize(s);
                            fetchOrderList(undefined, p, s);
                        }
                    }}
                />
            </DashboardSection>
        </>
    );
};

export default MyOrdersPage;


