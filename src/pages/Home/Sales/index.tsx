import React, { useEffect, useState } from "react";
import {Breadcrumb, Card, Col, Row, Typography, Spin, message} from "antd";
import EChart from "@/components/EChart";
import { getRequest } from "@/components/network/api";

const { Title } = Typography;

interface SalesData {
    sales_num_by_city_volist: Array<{
        city_name: string;
        accepting_num: number;
        accepted_num: number;
    }>;
    sales_num_by_type_volist: Array<{
        job_type: string;
        job_num: number;
    }>;
    total_accepted_num: number;
    total_retain_num: number;
}

const SalesPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSalesData();
    }, []);

    const fetchSalesData = async () => {
        try {
            setLoading(true);
            const response = await getRequest("/jobTask/salesDisplay", {}, true);
            
            if (response?.code === 200 && response?.data) {
                setSalesData(response.data);
            } else {
                setError(response?.msg || '获取销量数据失败');
            }
        } catch (error: any) {
            console.error('获取销量数据失败:', error);
            setError('获取销量数据失败，请重试');
        } finally {
            setLoading(false);
        }
    };

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
                    正在加载销量数据...
                </div>
            </div>
        );
    }

    if (error || !salesData) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Title level={3} type="danger">{error || '数据加载失败'}</Title>
                <button onClick={fetchSalesData} style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #d9d9d9',
                    background: '#fff',
                    cursor: 'pointer'
                }}>
                    重新加载
                </button>
            </div>
        );
    }

    // 准备城市数据
    const cityNames = salesData.sales_num_by_city_volist.map(item => item.city_name);
    const unacceptedData = salesData.sales_num_by_city_volist.map(item => item.accepting_num); // 可以接单（待接单）
    const acceptedData = salesData.sales_num_by_city_volist.map(item => item.accepted_num); // 已经接单

    // 准备岗位数据
    const jobTypeData = salesData.sales_num_by_type_volist.map(item => ({
        value: item.job_num,
        name: item.job_type
    }));

    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '销量展示' },
            ]} />
            
            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
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
                                <span>📊</span>
                                <span>按城市销量分布</span>
                            </div>
                        }
                    >
                        <EChart
                            style={{height: 280}}
                            option={{
                                tooltip: { 
                                    trigger: 'axis',
                                    formatter: function(params: any) {
                                        let result = params[0].name + '<br/>';
                                        params.forEach((param: any) => {
                                            result += param.marker + param.seriesName + ': ' + param.value + '<br/>';
                                        });
                                        return result;
                                    }
                                },
                                grid: { left: 24, right: 12, top: 40, bottom: 60 },
                                xAxis: { 
                                    type: 'category', 
                                    data: cityNames,
                                    axisLabel: {
                                        rotate: 30,
                                        fontSize: 11,
                                        margin: 16,
                                        interval: 0
                                    },
                                    axisTick: {
                                        alignWithLabel: true
                                    }
                                },
                                yAxis: { type: 'value' },
                                legend: { 
                                    data: ['待接单', '已接单'],
                                    top: 10
                                },
                                series: [
                                    { 
                                        name: '待接单', 
                                        type: 'bar', 
                                        data: unacceptedData, 
                                        itemStyle: { color: '#1890ff' },
                                        emphasis: {
                                            itemStyle: {
                                                color: '#40a9ff'
                                            }
                                        }
                                    },
                                    { 
                                        name: '已接单', 
                                        type: 'bar', 
                                        data: acceptedData, 
                                        itemStyle: { color: '#52c41a' },
                                        emphasis: {
                                            itemStyle: {
                                                color: '#73d13d'
                                            }
                                        }
                                    },
                                ]
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
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
                                <span>📈</span>
                                <span>接单状态比例</span>
                            </div>
                        }
                    >
                        <EChart
                            style={{height: 280}}
                            option={{
                                tooltip: {
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                                },
                                series: [
                                    {
                                        name: '接单状态',
                                        type: 'pie',
                                        radius: ['60%','85%'],
                                        avoidLabelOverlap: false,
                                        label: { 
                                            show: true, 
                                            position: 'center', 
                                            formatter: `{b}\n{c}`,
                                            fontSize: 14,
                                            fontWeight: 600
                                        },
                                        data: [
                                            { 
                                                value: salesData.total_accepted_num, 
                                                name: '已接单',
                                                itemStyle: { color: '#52c41a' }
                                            },
                                            { 
                                                value: salesData.total_retain_num, 
                                                name: '未接单',
                                                itemStyle: { color: '#1890ff' }
                                            },
                                        ],
                                        color: ['#52c41a','#1890ff']
                                    }
                                ]
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
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
                                <span>🏢</span>
                                <span>按岗位分布</span>
                            </div>
                        }
                    >
                        <EChart
                            style={{height: 280}}
                            option={{
                                tooltip: { 
                                    trigger: 'item',
                                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                                },
                                legend: { 
                                    top: 'bottom',
                                    textStyle: {
                                        fontSize: 12
                                    }
                                },
                                series: [
                                    {
                                        name: '岗位分布',
                                        type: 'pie',
                                        radius: ['40%','70%'],
                                        label: { 
                                            formatter: '{b}: {c}',
                                            fontSize: 12
                                        },
                                        data: jobTypeData,
                                        color: ['#16a34a','#06b6d4','#f59e0b','#ef4444','#6366f1','#8b5cf6','#ec4899']
                                    }
                                ]
                            }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default SalesPage;



