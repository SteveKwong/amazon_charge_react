import React, {useState} from "react";
import {Button, Modal, Typography, Input, Form, message, Image, Spin} from "antd";
import {EditOutlined, AudioOutlined, MoreOutlined} from "@ant-design/icons";
import { postRequest } from "@/components/network/api";

type RightActionBarProps = {
    qrSrc?: string;
    style?: React.CSSProperties; // 支持自定义定位样式
};

const RightActionBar: React.FC<RightActionBarProps> = ({ qrSrc = "/qr-cs.png", style }) => {
    const [openSuggest, setOpenSuggest] = useState(false);
    const [openContact, setOpenContact] = useState(false);
    const [form] = Form.useForm();
    const [expanded, setExpanded] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const submitSuggestion = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            
            const response = await postRequest("/user/suggestion", {
                usr_suggestion: values.content,
                contact_way: values.contact || ""
            }, true);
            
            if (response?.code === 200) {
                message.success("提交成功，感谢您的建议！");
                setOpenSuggest(false);
                form.resetFields();
            } else {
                message.error(response?.msg || "提交失败，请重试");
            }
        } catch (error: any) {
            console.error("提交建议失败:", error);
            message.error("提交失败，请重试");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                style={{
                    position: 'fixed',
                    right: 12,
                    top: '35%',
                    zIndex: 1000,
                    background: '#f0f0f0',
                    borderRadius: 24,
                    padding: expanded ? 8 : 6,
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all .2s ease-in-out',
                    ...(style || {})
                }}
            >
                {expanded ? (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        <Button
                            type="default"
                            shape="circle"
                            icon={<EditOutlined />}
                            onClick={() => setOpenSuggest(true)}
                            style={{ width: 40, height: 40, border: 'none' }}
                        />
                        <Button
                            type="default"
                            shape="circle"
                            icon={<AudioOutlined />}
                            onClick={() => setOpenContact(true)}
                            style={{ width: 40, height: 40, border: 'none' }}
                        />
                    </div>
                ) : (
                    <Button
                        type="default"
                        shape="circle"
                        icon={<MoreOutlined />}
                        style={{ width: 36, height: 36, border: 'none' }}
                        // 提示：移入即可展开
                        onMouseEnter={() => setExpanded(true)}
                    />
                )}
            </div>

            <Modal
                title="提交建议"
                open={openSuggest}
                onCancel={() => !submitting && setOpenSuggest(false)}
                onOk={submitSuggestion}
                okText={submitting ? "提交中..." : "提交"}
                cancelText="取消"
                centered
                confirmLoading={submitting}
                maskClosable={!submitting}
                closable={!submitting}
            >
                <Typography.Paragraph type="secondary" style={{marginBottom: 12}}>
                    我们非常重视您的意见与建议。请填写您的建议内容和联系方式，我们会认真处理您的反馈。
                </Typography.Paragraph>
                <Form layout="vertical" form={form}>
                    <Form.Item
                        label="建议内容"
                        name="content"
                        rules={[
                            { required: true, message: '请输入您的建议' },
                            { min: 1, message: '建议内容不能为空' }
                        ]}
                    >
                        <Input.TextArea 
                            rows={5} 
                            placeholder="请输入您的建议或问题…" 
                            allowClear 
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                    <Form.Item 
                        label="联系方式" 
                        name="contact"
                        rules={[
                            { required: true, message: '请输入联系方式' },
                            { min: 1, message: '联系方式不能为空' }
                        ]}
                    >
                        <Input placeholder="邮箱/微信/手机号" allowClear />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="添加客服联系"
                open={openContact}
                onCancel={() => setOpenContact(false)}
                footer={null}
                centered
            >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                    <Image src={qrSrc} alt="添加客服联系" width={260} preview={false} style={{borderRadius: 8}} />
                    <Typography.Text type="secondary">请使用微信/手机扫码添加客服</Typography.Text>
                </div>
            </Modal>
        </>
    );
};

export default RightActionBar;


