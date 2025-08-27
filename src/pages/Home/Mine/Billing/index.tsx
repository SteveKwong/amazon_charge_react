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
    Tabs,
    DatePicker,
    ConfigProvider
} from "antd";
import zhCN from "antd/locale/zh_CN";
import {
    SendOutlined,
    PlusOutlined,
    DownloadOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    WechatOutlined,
    AlipayOutlined,
    CalendarOutlined,
    ReloadOutlined
} from "@ant-design/icons";
import RightActionBar from "@/components/RightActionBar";
import { getRequest, postRequest } from "@/components/network/api";
import EChart from "@/components/EChart";
import "./index.scss";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

// 设置dayjs为中文
dayjs.locale("zh-cn");

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// API响应数据接口
interface UserDisplayBalanceIneStatistics {
    balance: number;
    monthly_income: number;
    compared_with_last_month_expenditure: string;
    monthly_expenditure: number;
    compared_with_last_month_income: string;
    list_income_withdrawal_statistics: Array<{
        expenditure_money: number;
        income_money: number;
        month: string;
    }>;
}

interface ApiResponse {
    msg: string;
    code: number;
    userDisplayBalanceIneStatistics: UserDisplayBalanceIneStatistics;
}

// 收入提现数据接口
interface IncomeExpenseData {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

// 收支记录接口
interface TransactionRecord {
    type: string;
    money: number;
    status: string;
    pay_method: string | null;
    datetime: string;
}

const MyBillingPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [incomeChange, setIncomeChange] = useState("+0%");
    const [expenseChange, setExpenseChange] = useState("+0%");
    const [showBalance, setShowBalance] = useState(true);
    const [rechargeModalVisible, setRechargeModalVisible] = useState(false);
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [withdrawMethod, setWithdrawMethod] = useState<'wechat' | 'alipay'>('wechat');
    const [withdrawAmount, setWithdrawAmount] = useState(200);
    const [withdrawForm] = Form.useForm();
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [chartType, setChartType] = useState<'income' | 'expense'>('income');
    
    // 时间范围选择
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(11, 'month'),
        dayjs()
    ]);
    
    // 图表数据
    const [monthlyData, setMonthlyData] = useState<IncomeExpenseData[]>([]);

    // 收支记录数据
    const [transactionRecords, setTransactionRecords] = useState<TransactionRecord[]>([]);
    const [transactionLoading, setTransactionLoading] = useState(false);

    useEffect(() => {
        fetchBillingData();
        fetchTransactionList();
    }, [dateRange]);

    const fetchBillingData = async () => {
        setLoading(true);
        try {
            const startMonth = dateRange[0].format('YYYY-MM');
            const endMonth = dateRange[1].format('YYYY-MM');
            
            console.log('调用接口参数:', { startMonth, endMonth });
            
            const response = await getRequest(
                "rechargeOrder/userDisplayBalanceIneStatistics",
                { startMonth, endMonth },
                true
            ) as ApiResponse;
            
            console.log('接口响应:', response);
            
            if (response.code === 200) {
                const data = response.userDisplayBalanceIneStatistics;
                
                // 更新余额和当月数据
                setBalance(data.balance);
                setIncome(data.monthly_income);
                setExpense(data.monthly_expenditure);
                setIncomeChange(data.compared_with_last_month_income);
                setExpenseChange(data.compared_with_last_month_expenditure);
                
                // 处理图表数据
                const chartData: IncomeExpenseData[] = data.list_income_withdrawal_statistics.map(item => ({
                    month: item.month,
                    income: item.income_money,
                    expense: item.expenditure_money,
                    balance: 0 // 这里可以根据需要计算累计余额
                }));
                
                setMonthlyData(chartData);
            } else {
                // 当数据为空时，不显示错误消息，只设置空数据
                if (response.code === 200) {
                    setBalance(0);
                    setIncome(0);
                    setExpense(0);
                    setIncomeChange("+0%");
                    setExpenseChange("+0%");
                    setMonthlyData([]);
                } else {
                    message.error(response.msg || '获取数据失败');
                }
            }
        } catch (error) {
            console.error('获取账单数据失败:', error);
            message.error('获取账单数据失败，请检查网络连接');
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

    // 处理时间范围变化
    const fetchTransactionList = async () => {
        try {
            setTransactionLoading(true);
            const response = await getRequest("rechargeOrder/userDisplayIneListInfo", {}, true);
            
            if (response?.code === 200 && response?.userDisplayIneListInfo) {
                setTransactionRecords(response.userDisplayIneListInfo);
            } else {
                setTransactionRecords([]);
            }
        } catch (error) {
            console.error('获取收支清单失败:', error);
            setTransactionRecords([]);
        } finally {
            setTransactionLoading(false);
        }
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setDateRange([dates[0], dates[1]]);
        }
    };

    // 根据图表类型生成图表配置
    const getChartOption = () => {
        if (monthlyData.length === 0) {
            return {
                title: {
                    text: '暂无数据',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontSize: 16,
                        color: '#999'
                    }
                }
            };
        }

        const data = chartType === 'income' 
            ? monthlyData.map(item => item.income)
            : monthlyData.map(item => item.expense);
        
        const color = chartType === 'income' ? '#52c41a' : '#fa8c16';
        const title = chartType === 'income' ? '收入统计' : '提现统计';
        
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
                                <span style="color: #52c41a">收入: ${data.value}元</span>`;
                    } else {
                        return `${data.name}<br/>
                                <span style="color: #fa8c16">提现: ${data.value}元</span>`;
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
            render: (type: string) => {
                const color = type === '收入' ? 'success' : type === '提现' ? 'error' : 'default';
                return <Tag color={color}>{type}</Tag>;
            },
        },
        {
            title: '金额',
            dataIndex: 'money',
            key: 'money',
            width: 120,
            render: (money: number, record: TransactionRecord) => {
                const isIncome = record.type === '收入' || record.type === '充值';
                return (
                    <Text type={isIncome ? 'success' : 'danger'}>
                        {isIncome ? '+' : '-'}{money.toFixed(2)}元
                    </Text>
                );
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={status === '成功' ? 'success' : 'error'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: '支付方式',
            dataIndex: 'pay_method',
            key: 'pay_method',
            width: 120,
            render: (payMethod: string | null) => {
                if (!payMethod) return '-';
                return payMethod;
            },
        },
        {
            title: '时间',
            dataIndex: 'datetime',
            key: 'datetime',
            width: 180,
            render: (datetime: string) => {
                return new Date(datetime).toLocaleString('zh-CN');
            },
        },
    ];

    return (
        <ConfigProvider locale={zhCN}>
            <div className="financial-dashboard">
                <Spin spinning={loading}>
                <Row gutter={24}>
                    {/* 主要内容区域 - 调整为全宽 */}
                    <Col span={24}>
                        {/* 当前余额卡片（替换原来的Total balance） */}
                        <Card className="current-balance-main-card" bordered={false}>
                            <div className="balance-header">
                                <div className="balance-info">
                                    <Text className="balance-label">余额</Text>
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
                                        size="large"
                                    >
                                        充值
                                    </Button>
                                    <Button 
                                        icon={<DownloadOutlined />} 
                                        className="action-btn withdraw-btn"
                                        onClick={() => setWithdrawModalVisible(true)}
                                        size="large"
                                    >
                                        提现
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* 收入和提现概览 - 增大卡片尺寸 */}
                        <Row gutter={24} style={{ marginBottom: 32 }}>
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
                                                {incomeChange.includes('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {incomeChange}
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
                                            <Text className="card-label">当月提现</Text>
                                            <div className="card-amount">{expense.toLocaleString()}</div>
                                        </div>
                                        <div className="change-tag">
                                            <Tag color="error" className="change-tag-content">
                                                {expenseChange.includes('+') ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {expenseChange}
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* 余额统计图表 */}
                        <Card className="chart-card" bordered={false}>
                            <div className="chart-header">
                                <Title level={4} className="chart-title">收入提现统计</Title>
                                <div className="chart-controls">
                                    <div className="date-range-picker">
                                        <CalendarOutlined style={{ marginRight: 8, color: '#666' }} />
                                        <RangePicker
                                            value={dateRange}
                                            onChange={handleDateRangeChange}
                                            picker="month"
                                            format="YYYY年MM月"
                                            placeholder={['开始月份', '结束月份']}
                                            style={{ width: 220 }}
                                        />
                                    </div>
                                    <Button 
                                        icon={<ReloadOutlined />}
                                        onClick={fetchBillingData}
                                        loading={loading}
                                        className="refresh-btn"
                                    >
                                        刷新
                                    </Button>
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
                                            提现
                                        </Button>
                                    </div>
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
                    rowKey={(record, index) => `${record.datetime}-${index}`}
                    loading={transactionLoading}
                    pagination={{
                        pageSize: 15,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                    }}
                    scroll={{ x: 1000 }}
                    size="middle"
                />
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
        </ConfigProvider>
    );
};

export default MyBillingPage;


