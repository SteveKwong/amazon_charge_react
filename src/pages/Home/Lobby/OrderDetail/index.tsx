import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Descriptions, Tag, Typography, Divider, Space, Button, Spin, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequest, postRequest } from '@/components/network/api';
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, DollarOutlined, GiftOutlined } from '@ant-design/icons';
import './index.scss';

const { Title, Text } = Typography;

interface OrderDetailData {
  id: string | number;
  title: string;
  job_type: string;
  city: string;
  salary: string;
  work_location?: string;
  work_location_detail?: string;
  welfare: string;
  policy_welfare: string;
  settlement_standard: string;
  start_date?: string;
  end_date?: string;
  hr_bonus: number;
  bonus: number;
  status: number;
  created_at: string;
  updated_at: string;
  service_fee: number;
  short_term_percent: string;
  long_term_percent: string;
  short_term_settlement_work_day: string;
  short_term_settlement_amount: number;
  long_term_settlement_work_day: string;
  long_term_settlement_amount: string;
  accepted?: boolean;
}

const OrderDetailPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptingOrder, setAcceptingOrder] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchOrderDetail();
    }
  }, [jobId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`/jobTask/details?jobId=${jobId}`, {}, true);
      
      if (response?.code === 200 && response?.data) {
        setOrderDetail(response.data);
      } else {
        setError(response?.msg || '获取订单详情失败');
      }
    } catch (error: any) {
      console.error('获取订单详情失败:', error);
      setError('获取订单详情失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async () => {
    if (!orderDetail || acceptingOrder) {
      return;
    }

    try {
      setAcceptingOrder(true);
      const response = await postRequest("/jobTask/memberApply", {
        job_id: orderDetail.id
      }, true);
      
      if (response?.code === 200) {
        message.success('接单成功！');
        // 接单成功后，重新获取订单详情
        await fetchOrderDetail();
      } else if (response?.code === 500) {
        message.error(response.msg || '接单失败');
      } else {
        message.error('接单失败，请重试');
      }
    } catch (error: any) {
      console.error('接单失败:', error);
      message.error('接单失败，请重试');
    } finally {
      setAcceptingOrder(false);
    }
  };

  const getStatusText = (status: number) => {
    const statusMap = {
      0: { text: '发布中', color: 'blue' },
      1: { text: '执行中', color: 'green' },
      2: { text: '结单', color: 'orange' },
      3: { text: '下架', color: 'red' }
    };
    return statusMap[status as keyof typeof statusMap] || { text: '未知', color: 'default' };
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '待定';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !orderDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Title level={3} type="danger">{error || '订单不存在'}</Title>
        <Button type="primary" onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
    );
  }

  const statusInfo = getStatusText(orderDetail.status);

  return (
    <div className="order-detail-page" style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 头部导航 */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          className="back-button"
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
        >
          返回接单大厅
        </Button>
      </div>

      {/* 主标题卡片 */}
      <Card 
        className="main-title-card"
        style={{ 
          marginBottom: '24px', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#262626' }}>
              {orderDetail.title}
            </Title>
            <Space size={16} style={{ marginTop: '16px' }}>
              <Tag color={statusInfo.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
                {statusInfo.text}
              </Tag>
              <Tag color="blue" icon={<EnvironmentOutlined />}>
                {orderDetail.city}
              </Tag>
              <Tag color="green" icon={<DollarOutlined />}>
                {orderDetail.salary}
              </Tag>
            </Space>
          </Col>
          <Col>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                ¥{orderDetail.service_fee}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>服务费</div>
              
              {/* 接单按钮 */}
              {orderDetail.status === 0 && !orderDetail.accepted && (
                <div style={{ marginTop: '16px' }}>
                  <Button 
                    type="primary" 
                    danger 
                    size="large"
                    loading={acceptingOrder}
                    disabled={acceptingOrder}
                    onClick={acceptOrder}
                    style={{
                      borderRadius: '8px',
                      height: '40px',
                      padding: '0 24px',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(245, 34, 45, 0.3)',
                      border: 'none'
                    }}
                  >
                    {acceptingOrder ? '接单中...' : '立即接单'}
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 基本信息 */}
        <Col xs={24} lg={16}>
          <Card 
            className="info-card"
            title="基本信息" 
            style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Descriptions column={2} size="middle">
              <Descriptions.Item label="工作性质" span={1}>
                <Tag color="blue">{orderDetail.job_type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="薪资范围" span={1}>
                <Text strong style={{ color: '#52c41a' }}>{orderDetail.salary}</Text>
              </Descriptions.Item>
              {orderDetail.work_location && (
                <Descriptions.Item label="工作站点" span={2}>
                  <Text>{orderDetail.work_location}</Text>
                </Descriptions.Item>
              )}
              {orderDetail.work_location_detail && (
                <Descriptions.Item label="详细地址" span={2}>
                  <Text type="secondary">{orderDetail.work_location_detail}</Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="结算标准" span={2}>
                <Text strong style={{ color: '#1890ff' }}>{orderDetail.settlement_standard}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 福利待遇 */}
          <Card 
            className="info-card"
            title="福利待遇" 
            style={{ 
              marginTop: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ color: '#1890ff', marginBottom: '12px' }}>
                <GiftOutlined /> 站点福利
              </Title>
              <Text style={{ lineHeight: '1.8', fontSize: '14px' }}>
                {orderDetail.welfare}
              </Text>
            </div>
            
            <Divider />
            
            <div>
              <Title level={5} style={{ color: '#52c41a', marginBottom: '12px' }}>
                <GiftOutlined /> 政策福利
              </Title>
              <Text style={{ lineHeight: '1.8', fontSize: '14px' }}>
                {orderDetail.policy_welfare}
              </Text>
            </div>
          </Card>
        </Col>

        {/* 右侧信息栏 */}
        <Col xs={24} lg={8}>
          {/* 奖励信息 */}
          <Card 
            className="info-card reward-card"
            title="奖励信息" 
            style={{ 
              marginBottom: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '28px', fontWeight: 600, color: '#f5222d' }}>
                ¥{orderDetail.hr_bonus}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>HR入职奖励</div>
            </div>
            
            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 600, color: '#fa8c16' }}>
                ¥{orderDetail.bonus}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>入职奖励</div>
            </div>
          </Card>

          {/* 结算规则 */}
          <Card 
            className="info-card settlement-rule"
            title="结算规则" 
            style={{ 
              marginBottom: '24px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                padding: '16px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>短期结算</div>
                <div style={{ fontSize: '20px', fontWeight: 600 }}>
                  {orderDetail.short_term_settlement_work_day}天 {orderDetail.short_term_percent}
                </div>
                <div style={{ fontSize: '18px', marginTop: '8px' }}>
                  ¥{orderDetail.short_term_settlement_amount}
                </div>
              </div>
            </div>
            
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
              color: 'white', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>长期结算</div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>
                {orderDetail.long_term_settlement_work_day}天 {orderDetail.long_term_percent}
              </div>
              <div style={{ fontSize: '18px', marginTop: '8px' }}>
                ¥{orderDetail.long_term_settlement_amount}
              </div>
            </div>
          </Card>

          {/* 时间信息 */}
          <Card 
            className="info-card time-info"
            title="时间信息" 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                <CalendarOutlined /> 开始日期
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>
                {formatDate(orderDetail.start_date)}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                <CalendarOutlined /> 结束日期
              </div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>
                {formatDate(orderDetail.end_date)}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetailPage;
