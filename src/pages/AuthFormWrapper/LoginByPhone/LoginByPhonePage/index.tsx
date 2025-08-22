import React, {useState, useEffect} from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import LoginForm from "@/pages/AuthFormWrapper/Login/LoginForm";
import Navigate from "@/pages/Navigate";
import {Spin} from 'antd';
import MyFooter from "@/pages/AuthFormWrapper/Footer";
import JobDisplay from "@/pages/AuthFormWrapper/JobDisplay/index"; // 使用 Ant Design 的 Spin 组件作为过场动画
import { Button } from "antd";
import LoginByPhoneForm from "@/pages/AuthFormWrapper/LoginByPhone/LoginByPhoneForm";
import wallpaper from "@/components/Law Firm Website in Gold Blue Sleek Corporate Style (3).png";


const LoginByPhone: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // 清理定时器以避免内存泄漏
    }, []);



    const footerStyle: React.CSSProperties = {
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'black',
        fontSize: '12px', // 设置字体大小，让文字更紧凑
        padding: '10px 0', // 设置上下内边距使其更窄
    };

    return (
        <>
            {/*加载页面*/}
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <Spin size="large"/>
                </div>
            ) : (
                // 主页
                <>
                    <Navigate/>
                    <Wall>
                        <LoginByPhoneForm/>
                    </Wall>
                    <MyFooter/>
                </>
            )}
        </>
    );
};

export default LoginByPhone;
