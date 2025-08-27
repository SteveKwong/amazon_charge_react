import React, {useEffect, useMemo, useState} from "react";
import {Breadcrumb, Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message, Statistic, Spin} from "antd";
import { useNavigate } from "react-router-dom";
import DashboardSection from "@/components/DashboardSection";
import {getRequest, postRequest} from "@/components/network/api";
import './index.scss';
import EChart from "@/components/EChart";
import TokenExpiredModal from "@/components/TokenExpiredModal";

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
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [data, setData] = useState<JobTask[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1); // antd 1-based
    const [pageSize, setPageSize] = useState<number>(10);
    const [cities, setCities] = useState<string[]>([]);
    const [jobTypes, setJobTypes] = useState<string[]>([]);
    const [detailItem, setDetailItem] = useState<JobTask | null>(null);
    // 统计数据
    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [acceptingOrdersCount, setAcceptingOrdersCount] = useState<number>(0);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [availableQuota, setAvailableQuota] = useState<number>(0);
    
    // Token过期状态
    const [tokenExpired, setTokenExpired] = useState<boolean>(false);
    
    // 页面整体加载状态
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    
    // 接单中的订单ID集合
    const [acceptingOrderIds, setAcceptingOrderIds] = useState<Set<string | number>>(new Set());

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
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setTokenExpired(true);
            }
            // 忽略其他错误，保持为空
        }
    };

    // 获取统计数据
    const fetchStatistics = async () => {
        try {
            const response = await getRequest("/jobTask/taskNumPage", {}, true);
            if (response?.code === 200 && response?.data) {
                const { total_task_num, accepting_num, total_task_money, can_accepting_num } = response.data;
                setTotalOrders(total_task_num || 0);
                setAcceptingOrdersCount(accepting_num || 0);
                setTotalAmount(total_task_money || 0);
                setAvailableQuota(can_accepting_num || 0);
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setTokenExpired(true);
            } else {
                console.error("获取统计数据失败:", error);
            }
        }
    };

    const fetchPage = async (q?: Partial<typeof initialQuery>, p: number = page, s: number = pageSize, showLoading: boolean = true) => {
        if (showLoading) {
            setLoading(true);
        }
        try {
            const values = form.getFieldsValue();
            const payload = {
                page: p,
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
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setTokenExpired(true);
            } else {
                console.error("获取订单列表失败:", error);
            }
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const initializePage = async () => {
            try {
                // 并行执行所有初始化请求
                await Promise.all([
                    fetchOptions(),
                    fetchStatistics(),
                    fetchPage(initialQuery, 1, pageSize, false)
                ]);
                
                // 设置表单初始值
                form.setFieldsValue(initialQuery);
                
                // 所有数据加载完成，隐藏加载状态
                setPageLoading(false);
            } catch (error) {
                console.error('页面初始化失败:', error);
                // 即使出错也要隐藏加载状态，避免页面一直加载
                setPageLoading(false);
            }
        };
        
        initializePage();
    }, []);

    const acceptOrder = async (record: JobTask) => {
        const orderId = String(record.id);
        
        // 如果正在接单中，直接返回
        if (acceptingOrderIds.has(orderId)) {
            return;
        }
        
        try {
            // 设置接单中状态
            setAcceptingOrderIds(prev => new Set(prev).add(orderId));
            
            const response = await postRequest("/jobTask/memberApply", {
                job_id: record.id
            }, true);
            
            if (response?.code === 200) {
                message.success('接单成功！');
                // 接单成功后，重新刷新页面数据和统计数据
                await Promise.all([
                    fetchPage(undefined, page, pageSize),
                    fetchStatistics()
                ]);
            } else if (response?.code === 500) {
                // 显示后端返回的错误信息
                message.error(response.msg || '接单失败');
            } else {
                message.error('接单失败，请重试');
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setTokenExpired(true);
            } else {
                console.error('接单失败:', error);
                message.error('接单失败，请重试');
            }
        } finally {
            // 无论成功失败，都要清除接单中状态
            setAcceptingOrderIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });
        }
    };

    const columns = [
        { title: '工作类型', dataIndex: 'title' },
        { title: '岗位', dataIndex: 'jobType' },
        { title: '城市', dataIndex: 'city' },
        { title: 'HR奖励', dataIndex: 'hrBonus', render: (v: any) => v ? `¥${v}` : '-' },
        { title: '服务费', dataIndex: 'serviceFee', render: (v: any) => v ? `¥${v}` : '-' },
        { title: '状态', dataIndex: 'status', render: (s: any) => <Tag color={s==='已接单' || s==='ACCEPTED' ? 'default' : 'blue'}>{s || '待接单'}</Tag> },
        {
            title: '一键接单',
            key: 'quickAccept',
            render: (_: any, record: JobTask) => {
                const isAccepting = acceptingOrderIds.has(String(record.id));
                return (
                    <Button 
                        type="primary" 
                        danger 
                        size="small" 
                        loading={isAccepting}
                        disabled={isAccepting}
                        onClick={() => acceptOrder(record)}
                    >
                        {isAccepting ? '接单中...' : '一键接单'}
                    </Button>
                );
            }
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: JobTask) => (
                <Space>
                    <Button 
                        size="small" 
                        type="primary" 
                        ghost 
                        onClick={() => navigate(`/home/order-detail/${record.id}`)}
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

    // 如果页面正在加载，显示加载状态
    if (pageLoading) {
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
                    正在加载接单大厅数据...
                </div>
            </div>
        );
    }

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
                                    title="正在接单数" 
                                    value={acceptingOrdersCount} 
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    正在接单数
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
                                    title="可接单数" 
                                    value={availableQuota} 
                                    valueStyle={{ color: '#fff', fontSize: '28px', fontWeight: 600 }}
                                />
                                <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', marginTop: 8 }}>
                                    可接单数
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
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>



                <Col span={24}>
                    <DashboardSection
                        style={{marginTop: 0}}
                        title="接单"
                        description="仅展示待接单的任务单"
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

            {/* Token过期提示弹窗 */}
            <TokenExpiredModal
                visible={tokenExpired}
                onClose={() => setTokenExpired(false)}
            />
        </>
    );
};

export default LobbyPage;


