import React, {useState, useEffect} from 'react';
import {Form, Input, Button, message, Typography} from 'antd';
import './index.scss';
import {useNavigate} from 'react-router-dom';
import {getRequest, postRequest} from '@/components/network/api'; // 你原来的请求封装
import {getInputPattern} from '@/commmon/CommonUtils'

const PhoneLoginForm: React.FC = () => {
    const [phoneNum, setPhoneNum] = useState<string>('');
    const [smsCode, setSmsCode] = useState<string>('');
    const [sending, setSending] = useState<boolean>(false);
    const [cooldown, setCooldown] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // 手机号正则
    const phonePattern = /^1[3-9]\d{9}$/;

    // 60秒倒计时
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    // 发送验证码
    const handleSendCode = async () => {

        const type = getInputPattern(phoneNum); // 'phone' 或 'email'

        if (type === '格式不正确') {
            message.error('请输入有效的手机号或者邮箱');
            return;
        }
        setSending(true);
        try {
            let response;
            if (type === 'phone') {
                response = await getRequest(`/portal/sendPhoneDynamicCode/${phoneNum}`);
            }
            if (type === 'email') {
                response = await getRequest(`/portal/sendEmailDynamicCode/${phoneNum}`);
            }

            if (response.code === 200) {
                message.success(response.msg || '验证码发送成功，请注意查收');
                setCooldown(60); // 设置60秒冷却
            } else {
                message.error(response.msg || '验证码发送失败');
            }
        } catch (err) {
            message.error('发送验证码失败，请稍后重试');
        } finally {
            setSending(false);
        }
    };

    // 登录校验
    const handleLogin = async () => {

        const type = getInputPattern(phoneNum); // 'phone' 或 'email'

        if (!phoneNum || !smsCode) {
            message.error('请输入手机号|邮箱和验证码');
            return;
        }

        if (type === '格式不正确') {
            message.error('请输入有效的手机号|邮箱');
            return;
        }
        setLoading(true);
        try {
            let response;
            if (type === 'phone') {
                response = await postRequest('/portal/phoneDynamicCodeLogin', {
                        phone: phoneNum,
                        sms_code: smsCode
                    }
                    , false);
            }
            if (type === 'email') {
                response = await postRequest('/portal/emailDynamicCodeLogin', {
                        email: phoneNum,
                        sms_code: smsCode
                    }
                    , false);
            }
            if (response.result?.success && response.result.token) {
                localStorage.setItem('token', response.result.token);
                message.success('登录成功');
                navigate("/home");
            } else {
                message.error('登录失败，验证码或手机号|邮箱错误');
            }
        } catch (err) {
            message.error('登录请求失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Form
                style={{width: 400, margin: '0 auto'}}
                layout="vertical"
                requiredMark={false}
                onFinish={handleLogin}
            >
                <h2>手机号|邮箱登录</h2>
                <div className="red-line"/>

                <Form.Item label="手机号或邮箱(自动识别)" name="phoneNum"
                           rules={[{required: true, message: '请输入手机号或邮箱'}]}>
                    <Input
                        placeholder="请输入手机号或邮箱"
                        value={phoneNum}
                        onChange={e => setPhoneNum(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="验证码" name="smsCode" rules={[{required: true, message: '请输入验证码'}]}>
                    <Input
                        placeholder="请输入验证码"
                        value={smsCode}
                        onChange={e => setSmsCode(e.target.value)}
                        addonAfter={
                            <Button
                                type="primary"
                                onClick={handleSendCode}
                                disabled={sending || cooldown > 0}
                                // style={{padding: '0 10px'}}
                            >
                                {cooldown > 0 ? `${cooldown}s` : '发送验证码'}
                            </Button>
                        }
                    />
                </Form.Item>

                <Form.Item>
                    <div style={{display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center'}}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            size="large"
                            style={{
                                flex: 1,
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '16px',
                            }}
                        >
                            登录
                        </Button>

                        <Button
                            type="default"
                            onClick={() => navigate("/")}
                            size="large"
                            style={{
                                flex: 1,
                                borderRadius: '8px',
                                fontWeight: 600,
                                fontSize: '16px',
                                color: '#2a2d58',
                            }}
                        >
                            返回
                        </Button>
                    </div>

                </Form.Item>
            </Form>
        </div>
    );
};

export default PhoneLoginForm;
