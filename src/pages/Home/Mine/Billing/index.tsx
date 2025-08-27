import React, { useEffect, useState } from "react";
import {
    Card,
    Button,
    Row,
    Col,
    Typography,
    Tag,
    Modal,
    Form,
    Input,
    Select,
    message,
    Spin,
    Radio,
    Divider,
    Space,
    Table,
    Tabs
} from "antd";
import {
    SendOutlined,
    PlusOutlined,
    DownloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    WechatOutlined,
    AlipayOutlined
} from "@ant-design/icons";
import RightActionBar from "@/components/RightActionBar";
import { getRequest, postRequest } from "@/components/network/api";
import EChart from "@/components/EChart";
import "./index.scss";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 收入支出数据接口
interface IncomeExpenseData {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

// 收支记录接口
interface TransactionRecord {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    category: string;
    date: string;
    paymentMethod: string;
}

const MyBillingPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(23432.03);
    const [income, setIncome] = useState(9990);
    const [expense, setExpense] = useState(1989);
    const [incomeChange, setIncomeChange] = useState(8.2);
    const [expenseChange, setExpenseChange] = useState(-6.6);
    const [showBalance, setShowBalance] = useState(true);
    const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [withdrawMethod, setWithdrawMethod] = useState<'wechat' | 'alipay'>('wechat');
    const [withdrawAmount, setWithdrawAmount] = useState(200);
    const [withdrawForm] = Form.useForm();
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [chartType, setChartType] = useState<'income' | 'expense'>('income');

    // 模拟月度数据
    const monthlyData: IncomeExpenseData[] = [
        { month: 'Jan', income: 8000, expense: 1200, balance: 6800 },
        { month: 'Feb', income: 8500, expense: 1100, balance: 14200 },
        { month: 'Mar', income: 9200, expense: 1300, balance: 22100 },
        { month: 'Apr', income: 8800, expense: 1400, balance: 29500 },
        { month: 'May', income: 9500, expense: 1200, balance: 37800 },
        { month: 'Jun', income: 8700, expense: 1600, balance: 44900 },
        { month: 'Jul', income: 9100, expense: 1350, balance: 52650 },
        { month: 'Aug', income: 8900, expense: 1250, balance: 60300 },
        { month: 'Sep', income: 9300, expense: 1189, balance: 68411 }
    ];

    // 模拟收支记录数据
    const transactionRecords: TransactionRecord[] = [
        { id: 1, type: 'income', amount: 5000, description: '工资收入', category: '工资', date: '2024-12-01', paymentMethod: '银行转账' },
        { id: 2, type: 'income', amount: 2000, description: '兼职收入', category: '兼职', date: '2024-12-02', paymentMethod: '支付宝' },
        { id: 3, type: 'income', amount: 1500, description: '奖金', category: '奖金', date: '2024-12-03', paymentMethod: '银行转账' },
        { id: 4, type: 'expense', amount: 800, description: '餐饮消费', category: '餐饮', date: '2024-12-01', paymentMethod: '微信支付' },
        { id: 5, type: 'expense', amount: 1200, description: '购物消费', category: '购物', date: '2024-12-02', paymentMethod: '支付宝' },
        { id: 6, type: 'expense', amount: 500, description: '交通费用', category: '交通', date: '2024-12-03', paymentMethod: '余额支付' },
        { id: 7, type: 'income', amount: 3000, description: '投资收益', category: '投资', date: '2024-12-04', paymentMethod: '银行转账' },
        { id: 8, type: 'expense', amount: 1500, description: '娱乐消费', category: '娱乐', date: '2024-12-04', paymentMethod: '微信支付' }
    ];

    useEffect(() => {
        fetchBillingData();
    }, []);

    const fetchBillingData = async () => {
        setLoading(true);
        try {
            // 实际项目中应该调用API
            // const response = await getRequest("/billing/overview", {}, true);
            
            // 使用模拟数据
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            console.error('获取账单数据失败:', error);
            message.error('获取账单数据失败');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (values: any) => {
        setWithdrawLoading(true);
        try {
            // 计算手续费（1%）
            const fee = withdrawAmount * 0.01;
            const actualAmount = withdrawAmount - fee;
            
            // 实际项目中应该调用提现API
            // await postRequest("/billing/withdraw", {
            //     amount: withdrawAmount,
            //     method: withdrawMethod,
            //     account: values.account,
            //     fee: fee,
            //     actualAmount: actualAmount
            // }, true);
            
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            message.success(`提现申请已提交！提现金额：${withdrawAmount}元，手续费：${fee.toFixed(2)}元，实际到账：${actualAmount.toFixed(2)}元`);
            setWithdrawModalVisible(false);
            withdrawForm.resetFields();
            setWithdrawAmount(200);
        } catch (error) {
            console.error('提现失败:', error);
            message.error('提现失败，请重试');
        } finally {
            setWithdrawLoading(false);
        }
    };

    // 根据图表类型生成图表配置
    const getChartOption = () => {
        const data = chartType === 'income' 
            ? monthlyData.map(item => item.income)
            : monthlyData.map(item => item.expense);
        
        const color = chartType === 'income' ? '#52c41a' : '#fa8c16';
        const title = chartType === 'income' ? 'Income Statistics' : 'Expense Statistics';
        
        return {
            title: {
                text: title,
                left: 'left',
                bottom: 10,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#333'
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params: any) {
                    const data = params[0];
                    const monthData = monthlyData[data.dataIndex];
                    if (chartType === 'income') {
                        return `${data.name}<br/>
                                <span style="color: #52c41a">收入: ${data.value}元</span><br/>
                                <span style="color: #fa8c16">支出: ${monthData.expense}元</span><br/>
                                <span style="color: #1890ff">余额: ${monthData.balance}元</span>`;
                    } else {
                        return `${data.name}<br/>
                                <span style="color: #fa8c16">支出: ${data.value}元</span><br/>
                                <span style="color: #52c41a">收入: ${monthData.income}元</span><br/>
                                <span style="color: #1890ff">余额: ${monthData.balance}元</span>`;
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: monthlyData.map(item => item.month),
                axisLine: {
                    lineStyle: {
                        color: '#e8e8e8'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#666',
                    fontSize: 12
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    color: '#666',
                    fontSize: 12,
                    formatter: '{value}'
                },
                splitLine: {
                    lineStyle: {
                        color: '#f0f0f0'
                    }
                }
            },
            series: [
                {
                    name: chartType === 'income' ? 'Income' : 'Expense',
                    type: 'line',
                    smooth: true,
                    data: data,
                    lineStyle: {
                        color: color,
                        width: 3
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: chartType === 'income' ? 'rgba(82, 196, 26, 0.2)' : 'rgba(250, 140, 22, 0.2)' },
                                { offset: 1, color: chartType === 'income' ? 'rgba(82, 196, 26, 0.05)' : 'rgba(250, 140, 22, 0.05)' }
                            ]
                        }
                    },
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {
                        color: color,
                        borderColor: '#fff',
                        borderWidth: 2
                    }
                }
            ]
        };
    };

    // 收支记录表格列配置
    const transactionColumns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: string) => (
                <Tag color={type === 'income' ? 'success' : 'error'}>
                    {type === 'income' ? '收入' : '支出'}
                </Tag>
            ),
        },
        {
            title: '金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
            render: (amount: number, record: TransactionRecord) => (
                <Text type={record.type === 'income' ? 'success' : 'danger'}>
                    {record.type === 'income' ? '+' : '-'}{amount.toFixed(2)}元
                </Text>
            ),
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '分类',
            dataIndex: 'category',
            key: 'category',
            width: 100,
        },
        {
            title: '支付方式',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 120,
        },
        {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
            width: 120,
        },
    ];

    return (
        <div className="financial-dashboard">
            <Spin spinning={loading}>
                <Row gutter={24}>
                    {/* 左侧主要内容区域 */}
                    <Col span={16}>
                        {/* 当前余额卡片（替换原来的Total balance） */}
                        <Card className="current-balance-main-card" bordered={false}>
                            <div className="balance-header">
                                <div className="balance-info">
                                    <Text className="balance-label">Current balance</Text>
                                    <div className="balance-amount">
                                        <span className="amount">{showBalance ? balance.toLocaleString() : '****'}</span>
                                    </div>
                                </div>
                                <div className="balance-actions">
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />} 
                                        className="action-btn recharge-btn"
                                        onClick={() => setRechargeModalVisible(true)}
                                    >
                                        充值
                                    </Button>
                                    <Button 
                                        icon={<DownloadOutlined />} 
                                        className="action-btn withdraw-btn"
                                        onClick={() => setWithdrawModalVisible(true)}
                                    >
                                        提现
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* 收入和支出概览 */}
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={12}>
                                <Card className="income-card" bordered={false}>
                                    <div className="card-content">
                                        <div className="icon-section">
                                            <div className="icon-circle income-icon">
                                                <ArrowDownOutlined />
                                            </div>
                                        </div>
                                        <div className="text-section">
                                            <Text className="card-label">当月收入</Text>
                                            <div className="card-amount">{income.toLocaleString()}</div>
                                        </div>
                                        <div className="change-tag">
                                            <Tag color="success" className="change-tag-content">
                                                <ArrowUpOutlined /> +{incomeChange}%
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card className="expense-card" bordered={false}>
                                    <div className="card-content">
                                        <div className="icon-section">
                                            <div className="icon-circle expense-icon">
                                                <ArrowUpOutlined />
                                            </div>
                                        </div>
                                        <div className="text-section">
                                            <Text className="card-label">当月支出</Text>
                                            <div className="card-amount">{expense.toLocaleString()}</div>
                                        </div>
                                        <div className="change-tag">
                                            <Tag color="error" className="change-tag-content">
                                                <ArrowDownOutlined /> {expenseChange}%
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* 余额统计图表 */}
                        <Card className="chart-card" bordered={false}>
                            <div className="chart-header">
                                <Title level={4} className="chart-title">Balance statistics</Title>
                                <div className="chart-type-selector">
                                    <Button 
                                        type={chartType === 'income' ? 'primary' : 'default'}
                                        onClick={() => setChartType('income')}
                                        className="chart-btn"
                                    >
                                        收入
                                    </Button>
                                    <Button 
                                        type={chartType === 'expense' ? 'primary' : 'default'}
                                        onClick={() => setChartType('expense')}
                                        className="chart-btn"
                                    >
                                        支出
                                    </Button>
                                </div>
                            </div>
                            <div className="chart-container">
                                <EChart option={getChartOption()} style={{ height: '300px' }} />
                            </div>
                        </Card>

                        {/* 收支清单 */}
                        <Card className="transaction-list-card" bordered={false}>
                            <Title level={4} className="list-title">收支清单</Title>
                            <Table
                                columns={transactionColumns}
                                dataSource={transactionRecords}
                                rowKey="id"
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total) => `共 ${total} 条记录`,
                                }}
                                scroll={{ x: 800 }}
                            />
                        </Card>
                    </Col>

                    {/* 右侧边栏 */}
                    <Col span={8}>
                        {/* 收入支出统计卡片 */}
                        <Card className="stats-card" bordered={false}>
                            <div className="stats-header">
                                <Title level={5} className="stats-title">本月统计</Title>
                            </div>
                            <div className="stats-content">
                                <div className="stat-item">
                                    <div className="stat-label">总收入</div>
                                    <div className="stat-value income">{income.toLocaleString()}</div>
                                    <div className="stat-change positive">+{incomeChange}%</div>
                                </div>
                                <Divider />
                                <div className="stat-item">
                                    <div className="stat-label">总支出</div>
                                    <div className="stat-value expense">{expense.toLocaleString()}</div>
                                    <div className="stat-change negative">{expenseChange}%</div>
                                </div>
                                <Divider />
                                <div className="stat-item">
                                    <div className="stat-label">净收入</div>
                                    <div className="stat-value net-income">{(income - expense).toLocaleString()}</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Spin>

            {/* 充值模态框 */}
            <Modal
                title="账户充值"
                open={rechargeModalVisible}
                onCancel={() => setRechargeModalVisible(false)}
                footer={null}
                width={500}
                className="recharge-modal"
            >
                <Form layout="vertical">
                    <Form.Item label="充值金额" name="amount" rules={[{ required: true, message: '请输入充值金额' }]}>
                        <Input type="number" placeholder="请输入充值金额" addonAfter="元" />
                    </Form.Item>
                    <Form.Item label="支付方式" name="paymentMethod" rules={[{ required: true, message: '请选择支付方式' }]}>
                        <Select placeholder="请选择支付方式">
                            <Option value="wechat">
                                <WechatOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                                微信支付
                            </Option>
                            <Option value="alipay">
                                <AlipayOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                                支付宝
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" onClick={() => setRechargeModalVisible(false)}>
                                确认充值
                            </Button>
                            <Button onClick={() => setRechargeModalVisible(false)}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 提现模态框 */}
            <Modal
                title="账户提现"
                open={withdrawModalVisible}
                onCancel={() => setWithdrawModalVisible(false)}
                footer={null}
                width={600}
                className="withdraw-modal"
                centered
            >
                <div className="withdraw-overlay">
                    <div className="payment-methods">
                        <div className="method-section">
                            <div className="method-header">
                                <WechatOutlined className="method-icon wechat" />
                                <span className="method-name">微信提现</span>
                            </div>
                            <Radio 
                                checked={withdrawMethod === 'wechat'}
                                onChange={() => setWithdrawMethod('wechat')}
                                className="method-radio"
                            />
                        </div>
                        <div className="method-section">
                            <div className="method-header">
                                <AlipayOutlined className="method-icon alipay" />
                                <span className="method-name">支付宝提现</span>
                            </div>
                            <Radio 
                                checked={withdrawMethod === 'alipay'}
                                onChange={() => setWithdrawMethod('alipay')}
                                className="method-radio"
                            />
                        </div>
                    </div>

                    <Divider />

                    <Form
                        form={withdrawForm}
                        onFinish={handleWithdraw}
                        layout="vertical"
                    >
                        <Form.Item
                            label="提现金额"
                            name="amount"
                            rules={[
                                { required: true, message: '请输入提现金额' },
                                { type: 'number', min: 100, message: '提现金额不能少于100元' },
                                { 
                                    validator: (_, value) => {
                                        if (value && value > balance) {
                                            return Promise.reject('提现金额不能超过账户余额');
                                        }
                                        return Promise.resolve();
                                    }
                                }
                            ]}
                        >
                            <Input
                                type="number"
                                placeholder="请输入提现金额"
                                addonAfter="元"
                                min={100}
                                max={balance}
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value) || 0)}
                            />
                        </Form.Item>

                        <Form.Item
                            label="收款账号"
                            name="account"
                            rules={[{ required: true, message: '请输入收款账号' }]}
                        >
                            <Input 
                                placeholder={withdrawMethod === 'wechat' ? '请输入微信账号' : '请输入支付宝账号'} 
                            />
                        </Form.Item>

                        <div className="fee-info">
                            <Text className="fee-label">手续费：1%</Text>
                            <div className="fee-calculation">
                                <Text>提现金额：{withdrawAmount}元</Text>
                                <Text>手续费：{(withdrawAmount * 0.01).toFixed(2)}元</Text>
                                <Text className="actual-amount">实际到账：{(withdrawAmount * 0.99).toFixed(2)}元</Text>
                            </div>
                        </div>

                        <Form.Item>
                            <Space>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={withdrawLoading}
                                    className="confirm-withdraw-btn"
                                >
                                    确认提现
                                </Button>
                                <Button onClick={() => setWithdrawModalVisible(false)}>
                                    取消
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </Modal>

            <RightActionBar
                style={{ left: 12, bottom: 12, right: 'auto', top: 'auto' }}
            />
        </div>
    );
};

export default MyBillingPage;


