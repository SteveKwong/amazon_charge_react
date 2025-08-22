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

    const handleLogin = async () => {
        if (!username || !password) {
            setError("* 请您输入用户名或密码");
            return;
        }

        setLoading(true);
        try {
            const response = await postRequest(
                "/portal/passWordLogin",
                { username, password },
                false
            );
            // 假设返回结构是 { msg, result: { registered, token, success }, code }
            const { result } = response;
            if (!result.registered) {
                setError("* 当前账户未注册，请先注册");
            } else if (result.registered && !result.success) {
                setError("* 用户名或密码错误，请重新输入");
            } else if (result.token) {
                localStorage.setItem("token", result.token);
                navigate("/home",{ replace: true });
            } else {
                setError("* 出现未知错误，请稍后再试");
            }
        } catch (err: any) {
            if (err.response) {
                // 服务器返回了非 2xx 状态码
                setError(`* 服务器错误: ${err.response.status} ${err.response.statusText}`);
            } else if (err.request) {
                // 请求发出但没有收到响应（网络问题/超时）
                setError("* 网络连接失败，请检查网络");
            } else {
                // 其他未知错误
                setError(`* 出现问题: ${err.message || "请稍后再试"}`);
            }
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


                <br />
                <div>
                    <Link href="/forget-password">忘记了您的密码?</Link>
                </div>
                <br />
                <div>
                    <Link href="/loginbyphone">手机号/邮箱验证码登录</Link>
                </div>
            </Form>
        </div>
    );
};

export default LoginForm;
