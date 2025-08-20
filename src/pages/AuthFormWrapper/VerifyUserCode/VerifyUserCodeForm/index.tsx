import React, {useEffect, useRef, useState} from 'react';
import {Form, Input, Button, Typography} from 'antd';
import {OTPProps} from 'antd/es/input/OTP';
import './index.scss';
import ErrorBox from "@/components/ui/ErrorBoxProps";
import {getRequest, postRequest} from "@/components/network/api";
import {useNavigate} from "react-router-dom";
// import { formatDate, randomId } from '@/common/CommonUtils';
import {getInputPattern} from '@/commmon/CommonUtils'

interface VerifyUserCodeFormProps {
    username: string;
    verificationCodeType: string;
}

const {Title} = Typography;

const VerifyUserCodeForm: React.FC<VerifyUserCodeFormProps> = ({username, verificationCodeType}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const [isCooldown, setIsCooldown] = useState(true);
    const [countdown, setCountdown] = useState(60);
    const timerRef = useRef(null);

    // 页面加载时就启动倒计时
    useEffect(() => {
        if (isCooldown) {
            // @ts-ignore
            timerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        // @ts-ignore
                        clearInterval(timerRef.current);
                        setIsCooldown(false);
                        return 60; // 复位，下次点击才会重新开始
                    }
                    return prev - 1;
                });
            }, 1000);
        }
// @ts-ignore
        return () => clearInterval(timerRef.current);
    }, [isCooldown]);

    // 用户点击“重新发送验证码”
    const coolDownVCSend = () => {
        if (isCooldown) return; // 冷却中就不触发
        setIsCooldown(true);
        setCountdown(60);
    };

    // 跳转到 resetUserCode 页面并携带参数
    const navigateToRestUserCode = (username: string) => {
        navigate('/reset-password', {state: {username}});
    };


    // 掩码处理函数
    const maskedUsername = (username: string) => {
        if (verificationCodeType === 'email') {
            // 如果是邮箱，掩盖@之前的部分
            const emailParts = username.split('@');
            const maskedEmail = `${emailParts[0].slice(0, 2)}*****@${emailParts[1]}`;
            return maskedEmail;
        } else if (verificationCodeType === 'phone') {
            // 如果是手机号，掩盖中间的四位
            const maskedPhone = `${username.slice(0, 3)}****${username.slice(7)}`;
            return maskedPhone;
        }
        return username;
    };

    // OTP 输入框的 onChange 和 onInput 事件
    const onChange: OTPProps['onChange'] = (text) => {
        console.log('onChange:', text);
        setOtp(text);
    };

    const onInput: OTPProps['onInput'] = (value) => {
        console.log('onInput:', value);
    };

    const handleSubmit = async () => {

        const inputPattern = getInputPattern(username);

        // 构造请求参数
        const requestData  = {
            [inputPattern]: username,
            sms_code: otp
        };
        // 校验 OTP 和 verificationCode 是否一致
        if (otp) {
            // 发送axios请求比对验证码
            try {
                const response = await postRequest(
                    "/portal/forgetPassword",
                    {[inputPattern]: username,sms_code: otp},
                    false
                );

                if (response.status === 500) {
                    setError(response.msg);
                }

                if (response.result === false) {
                    setError("*验证码有误,请重新尝试");
                    return;
                } else {
                    // 调用跳转方法并传递参数
                    navigateToRestUserCode(username);
                }
            } catch (err) {
                setError("*出现问题,请稍后再试");
            }
        } else {
            setError("验证码为空,请重新尝试")
        }
    };

    const sharedProps: OTPProps = {
        onChange,
        onInput,
    };


    return (
        <div className='login-container'>
            <Form
                onFinish={handleSubmit} // 提交表单时触发
                layout="vertical" // 垂直布局
                requiredMark={false} // 默认不显示必填标记
            >
                <h2>忘记密码</h2>
                <div className="red-line"/>
                {error && (
                    <ErrorBox
                        title="错误!"
                        message={error}
                    />
                )}
                <Title level={5}>
                    为了安全起见，我们已将验证码发送至
                    {verificationCodeType === 'email' ? '邮箱：' : '手机：'}
                    {maskedUsername(username)}
                </Title>
                <Form.Item
                    label="请输入验证码"
                    name="otp"
                    rules={[{required: true, message: '请输入验证码!'}]}
                    style={{width: '400px', margin: '0 auto'}} // 设置表单字段长度和居中样式
                >
                    {/* OTP 输入框 */}
                    <Input.OTP
                        value={otp}
                        onChange={(text) => setOtp(text)} // 直接将输入的文本赋值给 otp
                        length={6} // 设置验证码长度
                        formatter={(str) => str.toUpperCase()} // 格式化为大写字母
                        {...sharedProps}
                    />
                </Form.Item>
                <a
                    className="forgot-password-link"
                    onClick={coolDownVCSend}
                    style={{
                        color: isCooldown ? '#3d9894' : 'blue', // Blue color during cooldown
                        pointerEvents: isCooldown ? 'none' : 'auto', // Disable click during cooldown
                    }}
                >
                    {isCooldown ? `还有${countdown}秒可以发送` : '再次发送验证码'}
                </a>
                <br/>
                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{backgroundColor: 'yellow', borderColor: 'yellow', color: '#333'}}
                    >
                        提交
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default VerifyUserCodeForm;
