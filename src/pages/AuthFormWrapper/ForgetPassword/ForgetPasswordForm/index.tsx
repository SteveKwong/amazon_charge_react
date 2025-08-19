import React, {useEffect, useState} from 'react';
import {Form, Input, Button} from 'antd';
import './index.scss';
import {useNavigate} from "react-router-dom";
import {getRequest, postRequest} from "@/components/network/api";
import ErrorBox from "@/components/ui/ErrorBoxProps";
import getFontSizes from "antd/es/theme/themes/shared/genFontSizes";

const ForgetPasswordForm: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^1[3-9]\d{9}$/; // 中国手机号正则


    // 跳转到 VerifyUserCode 页面并携带参数
    const navigateToVerifyUserCode = (username: string, verificationCode: string, verificationCodeType: string) => {
        navigate('/verify-user-code', {state: {username, verificationCode, verificationCodeType}});
    };




    const handleLogin = async () => {
        // 重新
        setError('')

        if (!username) {
            setError("* 请您输入用户名");
            return;
        }

        // 判断类型
        let params: Record<string, string> = {};

        // 在提交前先进行自定义的正则校验
        if (emailPattern.test(username)) {
            params = {emailNum: username};
        } else if (phonePattern.test(username)) {
            params = {phoneNum: username};
        } else {
            setError("* 用户名格式不正确，请输入有效的邮箱或手机号");
            return;
        }

        setLoading(true);

        try {
            const response = await getRequest(
                "/portal/forgetPasswordValid",
                params,
                false
            );

            if (response.result === false || response.code === 500) {
                setError("* 抱歉,出现了问题,请点击重试或检验您的输入是否有误");
                return;
            } else {
                // 获取验证码
                const verificationCode = '123';
                // 验证码类型
                const verificationCodeType = '321';
                // 调用跳转方法并传递参数
                navigateToVerifyUserCode(username, verificationCode, verificationCodeType);
            }

        } catch (err) {
            setError("*出现问题,请稍后再试");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className='login-container'>
            <Form
                onFinish={handleLogin} // 提交表单时触发
                layout="vertical" // 垂直布局
                requiredMark={false} // 默认不显示必填标记
                style={{width: '400px', margin: '0 auto'}} // 设置表单字段长度和居中样式
            >
                <h2>忘记密码</h2>
                <div className="red-line"/>
                {error && (
                    <ErrorBox
                        title="错误!"
                        message={error}
                    />
                )}

                <Form.Item
                    label="用户名(邮箱或手机号):"
                    name="username"
                >
                    <br/>
                    <b style={{fontSize: '12px'}}>输入与您的帐户关联的电子邮件地址或手机号码</b>
                    <br/>
                    <Input
                        type="text"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // 设置用户名
                    />
                </Form.Item>

                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{backgroundColor: 'yellow',
                            color: '#333'}}
                    >
                        {"继续"}
                    </Button>
                </div>

            </Form>
        </div>
    );
};

export default ForgetPasswordForm;
