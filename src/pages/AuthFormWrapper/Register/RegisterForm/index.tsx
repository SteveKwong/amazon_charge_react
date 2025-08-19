import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {postRequest} from "@/components/network/api";
import {Button, Form, Input} from "antd";
import ErrorBox from "@/components/ui/ErrorBoxProps";

const RegisterForm = () => {
    /**
     * 用户名和密码
     */
    const [username, setUsername] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonContent, setButtonContent] = useState<string>("继续");
    const [returnContent, setReturnContent] = useState<string>("返回");


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
        if (!username || !password1) {
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
                {username, password1},
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
        const input = e.target.value
        if (e.target.id === 'username') {
            if (input.match(emailPattern)) {
                setButtonContent("验证邮箱")
            } else if (input.match(phonePattern)) {
                setButtonContent("验证手机")
            } else {
                setButtonContent("继续")
            }
        }

        setter(e.target.value);
        if ("*出现问题,请稍后再试" === error) {
            setError(""); // 输入框发生变化时清除错误信息
        }
    };


    /**
     * 修改按钮的内容
     */
    function changeButtonContent() {
        if (username.match(emailPattern)) {
            console.log(username)
            setButtonContent("邮箱确认")
        } else if (username.match(phonePattern)) {
            setButtonContent("手机号确认")
        } else {
            setButtonContent("继续")
        }
    }

    return (
        <div className='login-container'>
            <Form
                style={{width: '400px', margin: '0 auto'}} // 设置表单字段长度和居中样式
                onFinish={handleLogin} // 提交表单时触发
                layout="vertical" // 垂直布局
                requiredMark={false} // 默认不显示必填标记
            >
                <h2>注册</h2>
                {/* 在登录标题后添加红色的粗线 */}
                <div className="red-line"/>
                {error && (
                    <ErrorBox
                        title="出现错误!"
                        message={error}
                    />
                )}
                {/*姓名*/}
                <Form.Item
                    label="用户名:"
                    name="name"
                    rules={[{required: true, message: '请输入姓名'}]} // 添加校验规则
                >
                    <Input
                        type="text"
                        placeholder="例:张 三"
                        value={name}
                        onChange={handleInputChange(setName)}
                    />
                </Form.Item>
                {/*用户名*/}
                <Form.Item
                    label="手机号:"
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
                {/*密码*/}
                <Form.Item
                    label="密码:"
                    name="password1"
                    rules={[{required: true, message: '请输入密码'}]} // 添加校验规则
                >
                    <Input.Password
                        placeholder="最少六位数"
                        value={password1}
                        onChange={handleInputChange(setPassword1)}
                    />
                </Form.Item>
                {/*再次填写密码*/}
                <Form.Item
                    label="再次填写密码:"
                    name="password2"
                    rules={[{required: true, message: '再次填写密码'}]} // 添加校验规则
                >
                    <Input.Password
                        placeholder="再次填写密码"
                        value={password2}
                        onChange={changeButtonContent}
                    />
                </Form.Item>

                <div className="button-container">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        style={{backgroundColor: 'yellow', borderColor: 'yellow', color: '#333'}}
                    >
                        {buttonContent}
                    </Button>
                    <Button
                        type="default"
                        onClick={() => navigate("/")} // ✅ 传函数
                        variant="outlined"
                    >
                        {returnContent}
                    </Button>
                </div>

            </Form>
        </div>
    );
};

export default RegisterForm;
