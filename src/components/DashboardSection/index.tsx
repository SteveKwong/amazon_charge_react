import React from "react";
import {Card, Space, Typography} from "antd";

type DashboardSectionProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    extra?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
};

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, description, extra, children, style }) => {
    return (
        <Card
            bordered={false}
            style={{ borderRadius: 12, ...style }}
            title={
                <Space direction="vertical" size={2} style={{display: 'flex'}}>
                    <Typography.Text style={{fontSize: 18, fontWeight: 600}}>{title}</Typography.Text>
                    {description && <Typography.Text type="secondary">{description}</Typography.Text>}
                </Space>
            }
            extra={extra}
        >
            {children}
        </Card>
    );
};

export default DashboardSection;



