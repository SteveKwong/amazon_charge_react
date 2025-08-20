import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {postRequest} from "@/components/network/api";
import {Button, Form, Input} from "antd";
import ErrorBox from "@/components/ui/ErrorBoxProps";
import {Typography} from 'antd';

const {Text} = Typography;

const ResetSuccessForm: React.FC = () => {

    const [buttonContent, setButtonContent] = useState<string>("继续");


    /**
     * 路径导航
     */
    const navigate = useNavigate();


    return (
        <div className='login-container'>
            <Form
            >
                <h2>修改成功</h2>
                <div className="red-line"/>

                <div style={{textAlign: 'center', marginTop: '30px'}}>
                    <Text
                        style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            letterSpacing: '2px',
                            padding: '20px 20px',
                            display: 'inline-block',
                        }}
                    >
                        点击下方按钮返回登陆页
                    </Text>
                </div>

                <div className="button-container">
                    <Button
                        type="primary"
                        onClick={()=>navigate("/login")}
                        style={{backgroundColor: 'yellow', borderColor: 'yellow', color: '#333'}}
                    >
                        {buttonContent}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ResetSuccessForm;
