import React, {useState} from 'react';
import {Form, Input, Button, Typography} from 'antd';
import './index.scss';
import {Link, useNavigate} from "react-router-dom";
import {postRequest} from "@/components/network/api";
import ErrorBox from "@/components/ui/ErrorBoxProps";

const LoginForm: React.FC = () => {
    /**
     * 用户名和密码
     */
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    /**
     * 路径导航
     */
    const navigate = useNavigate();
    /**
     * 正则表达式
     */
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^1[3-9]\d{9}$/; // 中国手机号正则

    const handleLogin = async () => {

        if (!username || !password) {
            setError("* 请您输入用户名或密码");
            return;
        }

        // 在提交前先进行自定义的正则校验
        if (!emailPattern.test(username) && !phonePattern.test(username)) {
            setError("* 用户名格式不正确，请输入有效的邮箱或手机号");
            return;
        }
        setLoading(true);
        try {
            const response = await postRequest(
                "/login",
                {username, password},
                false
            );
            if (response.token) {
                localStorage.setItem("token", response.token);
                navigate("/home");
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("*出现问题,请稍后再试");

        } finally {
            setLoading(false);
        }
    };


    // 清除错误信息
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if ("*出现问题,请稍后再试" === error) {
            setError(""); // 输入框发生变化时清除错误信息
        }
    };
    const { Link } = Typography;

    return (
        <div className='login-container'>
            <Form
                style={{width: '400px', margin: '0 auto'}} // 设置表单字段长度和居中样式
                onFinish={handleLogin} // 提交表单时触发
                layout="vertical" // 垂直布局
                requiredMark={false} // 默认不显示必填标记
            >
                <h2>登录</h2>
                {/* 在登录标题后添加红色的粗线 */}
                <div className="red-line"/>
                {error && (
                    <ErrorBox
                        title="出现错误!"
                        message={error}
                    />
                )}

                <Form.Item
                    label="用户名:"
                    name="username"
                    rules={[{required: true, message: '请输入用户名'}]} // 添加校验规则
                >
                    <Input
                        type="text"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                    />
                </Form.Item>

                <Form.Item
                    label="密码:"
                    name="password"
                    rules={[{required: true, message: '请输入密码'}]} // 添加校验规则
                >
                    <Input.Password
                        placeholder="请输入密码"
                        value={password}
                        onChange={handleInputChange(setPassword)}
                    />
                </Form.Item>

                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{backgroundColor: 'yellow', borderColor: 'yellow', color: '#333'}}
                    >
                        登录
                    </Button>
                    <Button type="default" onClick={() => navigate('/register')} variant="outlined">
                        注册
                    </Button>
                </div>

                {/*<a href="/forgetpassword" className="forgot-password-link">*/}
                {/*    忘记了您的密码?*/}
                {/*</a>*/}

                {/*<a href="/forgetpassword" className="forgot-password-link">*/}
                {/*    手机号登录*/}
                {/*</a>*/}
                <br />
                <div>
                    <Link href="/forgetpassword">忘记了您的密码?</Link>
                </div>
                <br />
                <div>
                    <Link href="/loginbyphone">手机号登录</Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
