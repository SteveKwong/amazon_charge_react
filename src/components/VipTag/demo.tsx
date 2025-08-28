import React, { useState } from 'react';
import VipTag from './index';

const VipTagDemo: React.FC = () => {
    const [isVip, setIsVip] = useState(false);

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <h2>VipTag 会员标签组件演示 - 始终显示PLUS版本</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={() => setIsVip(!isVip)}
                    style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        borderRadius: '4px',
                        border: '1px solid #d9d9d9',
                        background: '#fff',
                        cursor: 'pointer'
                    }}
                >
                    切换会员状态 (当前: {isVip ? '会员' : '非会员'})
                </button>
            </div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '30px',
                alignItems: 'flex-start'
            }}>
                {/* 模拟Header布局 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8',
                    minWidth: '400px',
                    borderBottom: '1px solid #e5e5e5'
                }}>
                    <h3>Header布局演示:</h3>
                    
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '16px',
                        border: '1px dashed #d9d9d9',
                        borderRadius: '8px',
                        background: '#fafafa'
                    }}>
                        {/* 左侧内容 */}
                        <div style={{ fontSize: '14px', color: '#666' }}>
                            左侧内容区域
                        </div>
                        
                        {/* 右侧用户信息区域 */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            gap: '6px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(248, 249, 250, 0.6)',
                            border: '1px solid rgba(222, 226, 230, 0.3)',
                            transition: 'all 0.3s ease',
                            marginBottom: '4px',
                            cursor: 'pointer'
                        }}>
                            {/* 模拟头像 */}
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: '#1677ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>
                                {isVip ? 'V' : 'U'}
                            </div>
                            
                            {/* 模拟用户名 */}
                            <div style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#333'
                            }}>
                                {isVip ? 'VIP用户' : '普通用户'}
                            </div>
                            
                            {/* 会员标签 - 始终显示 */}
                            <VipTag isVip={isVip} />
                        </div>
                    </div>
                </div>

                {/* 标签样式对比 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>标签样式对比:</h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div>
                            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>会员状态:</div>
                            <VipTag isVip={true} />
                        </div>
                        <div>
                            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>非会员状态:</div>
                            <VipTag isVip={false} />
                        </div>
                    </div>
                    <div style={{ 
                        marginTop: '16px', 
                        padding: '12px', 
                        background: '#f8f9fa', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        <strong>设计说明:</strong> 非会员和会员都显示"PLUS"标签，会员使用红色渐变，非会员使用灰色渐变（透明度0.8）
                    </div>
                </div>

                {/* 布局优化说明 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>布局优化说明:</h3>
                    <ul>
                        <li>✅ 解决了PLUS标签卡在header线上的问题</li>
                        <li>✅ 用户信息区域有半透明背景和边框</li>
                        <li>✅ 增加了合适的间距和内边距</li>
                        <li>✅ Header高度设置为64px，确保有足够空间</li>
                        <li>✅ 用户信息区域有悬停效果</li>
                        <li>✅ PLUS标签尺寸优化为20px高度</li>
                        <li>✅ <strong>非会员和会员都显示PLUS标签，保持视觉一致性</strong></li>
                    </ul>
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
                        <li>✅ 根据接口返回的member字段自动判断会员状态</li>
                        <li>✅ 横标签页设计，适合放在用户信息下方</li>
                        <li>✅ <strong>非会员显示灰色PLUS标签</strong></li>
                        <li>✅ <strong>会员显示红色PLUS标签</strong></li>
                        <li>✅ 悬停效果和动画</li>
                        <li>✅ 支持自定义样式和类名</li>
                        <li>✅ 响应式设计</li>
                    </ul>
                </div>

                {/* 接口集成说明 */}
                <div style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '8px',
                    border: '1px solid #e8e8e8'
                }}>
                    <h3>接口集成说明:</h3>
                    <div style={{ 
                        background: '#f6f8fa', 
                        padding: '16px', 
                        borderRadius: '6px',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                    }}>
                        <div>接口: /jinx/user/getNicknameAndPicture</div>
                        <div>返回字段: member (boolean)</div>
                        <div>使用方式: userInfo?.member</div>
                        <div>标签显示: 始终显示PLUS，样式根据member值变化</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VipTagDemo;
