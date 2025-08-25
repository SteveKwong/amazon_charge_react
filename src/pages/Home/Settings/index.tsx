import React from "react";
import {Card, Typography} from "antd";

const { Title, Paragraph } = Typography;

const SettingsPage: React.FC = () => {
    return (
        <Card bordered>
            <Title level={4}>设置</Title>
            <Paragraph>这里是设置页面的占位内容，可根据需要补充表单与选项。</Paragraph>
        </Card>
    );
};

export default SettingsPage;


