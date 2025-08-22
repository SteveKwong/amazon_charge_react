import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {postRequest} from "@/components/network/api";
import {Button, Form, Input, message} from "antd";
import ErrorBox from "@/components/ui/ErrorBoxProps";

const RegisterForm: React.FC = () => {
    /**
     * 用户信息
     */
    const [name, setName] = useState<string>(""); // 真实姓名
    const [username, setUsername] = useState<string>(""); // 用户名（也可作为邮箱）
    const [phone, setPhone] = useState<string>(""); // 手机号
    const [email, setEmail] = useState<string>(""); // 邮箱
    const [password1, setPassword1] = useState<string>(""); // 密码
    const [password2, setPassword2] = useState<string>(""); // 确认密码
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    /**
     * 提交注册
     */
    const handleRegister = async () => {
        if (!username || !password1 || !phone || !email) {
            setError("* 请填写完整信息");
            return;
        }
        if (password1 !== password2) {
            setError("* 两次密码不一致");
            return;
        }

        setLoading(true);
        try {
            const response = await postRequest(
                "/portal/userSignUp",
                {
                    nickname: name,
                    username: username,
                    password: password1,
                    phone: phone,
                    email: email,
                    isMember: false,
                    surveyResult: ""
                },
                false
            );
            console.log(response.code);
            if (response.code === 500) {
                setError(response.msg);
            } else if (response.result === true) {
                message.success("注册成功");
                navigate("/login"); // 注册成功后跳转到登录页
            } else {
                setError("* 注册失败，请稍后再试");
            }
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 统一输入处理函数
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            if (error) setError(""); // 输入时清除错误提示
        };

    return (
        <div className='login-container'>
            <Form
                style={{
                    width: '400px',
                    margin: '-100px auto'
                }}
                onFinish={handleRegister}
                layout="vertical"
                requiredMark={false}
            >
                <h2>注册</h2>
                <div className="red-line"/>
                {error && (
                    <ErrorBox
                        title="出现错误!"
                        message={error}
                    />
                )}
                {/* 姓名 */}
                <Form.Item
                    label="姓名:"
                    name="name"
                    rules={[{required: true, message: '请输入姓名'}]}
                >
                    <Input
                        type="text"
                        placeholder="例: 张三"
                        value={name}
                        onChange={handleInputChange(setName)}
                    />
                </Form.Item>

                {/* 用户名 */}
                <Form.Item
                    label="用户名:"
                    name="username"
                    rules={[{required: true, message: '请输入用户名'}]}
                >
                    <Input
                        type="text"
                        placeholder="请输入用户名"
                        value={username}
                        onChange={handleInputChange(setUsername)}
                    />
                </Form.Item>

                {/* 手机号 */}
                <Form.Item
                    label="手机号:"
                    name="phone"
                    rules={[{required: true, message: '请输入手机号'}]}
                >
                    <Input
                        type="text"
                        placeholder="请输入手机号"
                        value={phone}
                        onChange={handleInputChange(setPhone)}
                    />
                </Form.Item>

                {/* 邮箱 */}
                <Form.Item
                    label="邮箱:"
                    name="email"
                    rules={[{required: true, message: '请输入邮箱'}]}
                >
                    <Input
                        type="email"
                        placeholder="请输入邮箱"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                    />
                </Form.Item>

                {/* 密码 */}
                <Form.Item
                    label="密码:"
                    name="password1"
                    rules={[{required: true, message: '请输入密码'}]}
                >
                    <Input.Password
                        placeholder="最少六位数"
                        value={password1}
                        onChange={handleInputChange(setPassword1)}
                    />
                </Form.Item>

                {/* 再次填写密码 */}
                <Form.Item
                    label="再次填写密码:"
                    name="password2"
                    rules={[{required: true, message: '请再次输入密码'}]}
                >
                    <Input.Password
                        placeholder="请再次输入密码"
                        value={password2}
                        onChange={handleInputChange(setPassword2)}
                    />
                </Form.Item>

                {/* 按钮组 */}
                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{backgroundColor: 'yellow', borderColor: 'yellow', color: '#333'}}
                    >
                        注册
                    </Button>
                    <Button
                        type="default"
                        onClick={() => navigate("/login")}
                        variant="outlined"
                    >
                        返回登录
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default RegisterForm;
