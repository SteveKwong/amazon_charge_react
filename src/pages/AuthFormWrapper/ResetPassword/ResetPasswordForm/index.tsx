import React, {useState} from 'react';
import {Form, Input, Button, Typography} from 'antd';
import {OTPProps} from 'antd/es/input/OTP';
import './index.scss';
import ErrorBox from "@/components/ui/ErrorBoxProps";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface VerifyUserCodeFormProps {
    username: string;
}

const {Title} = Typography;

const ResetPasswordForm: React.FC<VerifyUserCodeFormProps> = ({username}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [password1, setPassword1] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");


    /**
     * 进行密码的重置
     */
    const handleSubmit = () => {
        if (password1===password2){
            setError("")
            console.log(password1)
            console.log(password2)
            return;
        }else {
            setError("两次密码不匹配请重试")
            console.log(password1)
            console.log(password2)
            return;
        }
    };
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if ("*出现问题,请稍后再试" === error) {
            setError(""); // 输入框发生变化时清除错误信息
        }
    };
    return (
        <div className='login-container'>
            <Form
                onFinish={handleSubmit} // 提交表单时触发
                layout="vertical" // 垂直布局
                requiredMark={false} // 默认不显示必填标记
            >
                <h2>重置密码</h2>
                <div className="red-line"/>
                {/*重置密码,填写两次*/}
                {error && (
                    <ErrorBox
                        title="出现错误!"
                        message={error}
                    />
                )}

                <Form.Item
                    label="密码:"
                    name="password1"
                    rules={[{required: true, message: '请输入密码'}]} // 添加校验规则
                >
                    <Input.Password
                        placeholder="请输入密码"
                        value={password1}
                        onChange={handleInputChange(setPassword1)}
                    />
                </Form.Item>

                <Form.Item
                    label="再次填写密码:"
                    name="password2"
                    rules={[{required: true, message: '再次填写密码'}]} // 添加校验规则
                >
                    <Input.Password
                        placeholder="再次填写密码"
                        value={password2}
                        onChange={handleInputChange(setPassword2)}
                    />
                </Form.Item>


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

export default ResetPasswordForm;
