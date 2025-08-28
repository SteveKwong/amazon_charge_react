import React from 'react';
import DetailButton from './index';

const DetailButtonDemo: React.FC = () => {
    const handleViewDetail = (id: string) => {
        console.log('查看详情:', id);
        alert(`查看订单 ${id} 的详情`);
    };

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <h2>DetailButton 详情按钮组件演示</h2>
            
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '30px',
                alignItems: 'flex-start'
            }}>
                {/* 基本使用 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8',
                    minWidth: '400px'
                }}>
                    <h3>基本使用:</h3>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <DetailButton onClick={() => handleViewDetail('001')} />
                        <DetailButton onClick={() => handleViewDetail('002')}>
                            查看详情
                        </DetailButton>
                        <DetailButton onClick={() => handleViewDetail('003')}>
                            订单详情
                        </DetailButton>
                    </div>
                </div>

                {/* 样式特点 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>样式特点:</h3>
                    <ul>
                        <li>✅ 按钮尺寸: 高度36px，内边距20px</li>
                        <li>✅ 字体: 14px，黑体，字重600</li>
                        <li>✅ 圆角: 8px圆角设计</li>
                        <li>✅ 边框: 2px蓝色边框</li>
                        <li>✅ 阴影: 默认浅蓝色阴影</li>
                        <li>✅ 动画: 0.3秒过渡效果</li>
                    </ul>
                </div>

                {/* 悬停效果说明 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>悬停效果:</h3>
                    <div style={{ 
                        background: '#f6f8fa', 
                        padding: '16px', 
                        borderRadius: '6px',
                        fontSize: '14px',
                        color: '#666'
                    }}>
                        <strong>鼠标悬停时:</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>背景色从透明变为蓝色 (#1890ff)</li>
                            <li>文字色从蓝色变为白色 (#ffffff)</li>
                            <li>按钮轻微上浮2px</li>
                            <li>阴影加深，颜色变深</li>
                            <li>所有变化都有平滑的过渡动画</li>
                        </ul>
                    </div>
                </div>

                {/* 在表格中的使用 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>在表格中的使用:</h3>
                    <div style={{ 
                        border: '1px solid #e8e8e8',
                        borderRadius: '6px',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#fafafa' }}>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}>订单号</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}>工作类型</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}>城市</th>
                                    <th style={{ padding: '12px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>ORD001</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>前端开发</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>北京</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                        <DetailButton onClick={() => handleViewDetail('ORD001')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>ORD002</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>后端开发</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>上海</td>
                                    <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                        <DetailButton onClick={() => handleViewDetail('ORD002')} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '12px' }}>ORD003</td>
                                    <td style={{ padding: '12px' }}>UI设计</td>
                                    <td style={{ padding: '12px' }}>深圳</td>
                                    <td style={{ padding: '12px' }}>
                                        <DetailButton onClick={() => handleViewDetail('ORD003')} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 组件特性 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>组件特性:</h3>
                    <ul>
                        <li>✅ 专门为详情查看功能设计</li>
                        <li>✅ 美观的蓝色主题设计</li>
                        <li>✅ 丰富的悬停交互效果</li>
                        <li>✅ 支持自定义文字和样式</li>
                        <li>✅ 使用黑体字体，更加醒目</li>
                        <li>✅ 响应式设计，适配不同场景</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DetailButtonDemo;
