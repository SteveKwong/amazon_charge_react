import React, {useState} from 'react';
import {Form, Input, Button, Typography} from 'antd';
import {OTPProps} from 'antd/es/input/OTP';
import './index.scss';
import ErrorBox from "@/components/ui/ErrorBoxProps";
import {getRequest} from "@/components/network/api";
import navigate from "@/pages/Navigate";
import {useNavigate} from "react-router-dom";

interface VerifyUserCodeFormProps {
    username: string;
    verificationCodeType: string;
}

const {Title} = Typography;

const VerifyUserCodeForm: React.FC<VerifyUserCodeFormProps> = ({username, verificationCodeType}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [countdown, setCountdown] = useState(60);
    const [isCooldown, setIsCooldown] = useState(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    // coolDownVCSend method
    const coolDownVCSend = () => {
        setIsCooldown(true); // Start cooldown
        // Start countdown
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown === 1) {
                    clearInterval(timer); // Stop countdown
                    setIsCooldown(false); // Reset cooldown state
                    return 60; // Reset countdown to 60 for the next click
                }
                return prevCountdown - 1;
            });
        }, 1000);
    };

    // 跳转到 resetUserCode 页面并携带参数
    const navigateToRestUserCode = (username: string) => {
        navigate('/resetusercode', {state: {username}});
    };


    // 掩码处理函数
    const maskedUsername = () => {
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
        // 校验 OTP 和 verificationCode 是否一致
        if (otp) {
            // 发送axios请求比对验证码
            try {
                const response = await getRequest(
                    "/verifyCode",
                    {username, otp},
                    false
                );
                /**
                 * json格式=> {"username";"codeCorrect"}
                 */
                if (response.data.codeCorrect === false) {
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
                    {verificationCodeType === 'email' ? '电子邮件：' : '手机：176****8456'}
                    {maskedUsername()}
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
                    {isCooldown ? `後で${countdown}秒送信できます。` : 'コードを再送信する'}
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
