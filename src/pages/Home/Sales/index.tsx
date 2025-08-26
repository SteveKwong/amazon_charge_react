import React from "react";
import {Breadcrumb, Card, Col, Row, Typography} from "antd";
import EChart from "@/components/EChart";

const { Title } = Typography;

const SalesPage: React.FC = () => {
    // 假数据（可替换为真实汇总接口）
    const availableQuota = 186; // 可接单数量
    const quotaTotal = 500; // 总额度

    return (
        <>
            <Breadcrumb style={{marginBottom: 12}} items={[
                { title: '首页' },
                { title: '大厅' },
                { title: '销量展示' },
            ]} />
            
            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card bordered={false} style={{borderRadius: 12}} title="按城市销量（示例）">
                        <EChart
                            style={{height: 280}}
                            option={{
                                tooltip: { trigger: 'axis' },
                                grid: { left: 24, right: 12, top: 24, bottom: 24 },
                                xAxis: { type: 'category', data: ['上海','北京','广州','深圳','杭州','成都','重庆'] },
                                yAxis: { type: 'value' },
                                legend: { data: ['接单','取消'] },
                                series: [
                                    { name: '接单', type: 'bar', data: [95, 70, 66, 58, 48, 42, 36], itemStyle: { color: '#057a55' } },
                                    { name: '取消', type: 'bar', data: [42, 22, 18, 15, 12, 10, 9], itemStyle: { color: '#f59e0b' } },
                                ]
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card bordered={false} style={{borderRadius: 12}} title="可接单比例（示例）">
                        <EChart
                            style={{height: 280}}
                            option={{
                                series: [
                                    {
                                        type: 'pie',
                                        radius: ['60%','85%'],
                                        avoidLabelOverlap: false,
                                        label: { show: true, position: 'center', formatter: `{b}\n{c}` },
                                        data: [
                                            { value: availableQuota, name: '可接单' },
                                            { value: Math.max(0, quotaTotal - availableQuota), name: '剩余额度' },
                                        ],
                                        color: ['#10b981','#e5e7eb']
                                    }
                                ]
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24}>
                    <Card bordered={false} style={{borderRadius: 12}} title="按岗位分布（示例）">
                        <EChart
                            style={{height: 280}}
                            option={{
                                tooltip: { trigger: 'item' },
                                legend: { top: 'bottom' },
                                series: [
                                    {
                                        type: 'pie',
                                        radius: ['40%','70%'],
                                        label: { formatter: '{b}: {d}%' },
                                        data: [
                                            { value: 38, name: '外卖' },
                                            { value: 22, name: '仓储' },
                                            { value: 18, name: '配送' },
                                            { value: 12, name: '代驾' },
                                            { value: 10, name: '其他' }
                                        ],
                                        color: ['#16a34a','#06b6d4','#f59e0b','#ef4444','#6366f1']
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



