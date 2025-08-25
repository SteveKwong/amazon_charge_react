import React, {useState, useEffect} from 'react';
import Wall from "@/pages/AuthFormWrapper/Wall";
import LoginForm from "@/pages/AuthFormWrapper/Login/LoginForm";
import Navigate from "@/pages/Navigate";
import {Spin} from 'antd';
import MyFooter from "@/pages/AuthFormWrapper/Footer";
// 使用 Ant Design 的 Spin 组件作为过场动画
import wallpaper from "@/components/Law Firm Website in Gold Blue Sleek Corporate Style (3).png";


const LoginPage: React.FC = () => {

    const [loading, setLoading] = useState(true);



    useEffect(() => {
        // 若已登录，直接跳转到 /home，避免返回到登录页
        const token = localStorage.getItem('token');
        if (token) {
            // @ts-ignore
            window.location.replace('/home');
            return;
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer); // 清理定时器以避免内存泄漏
    }, []);

    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        // @ts-ignore
        img.src = {wallpaper};
        img.onload = () => setLoaded(true);
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
                <>
                    <Navigate/>
                    <Wall>
                        <LoginForm/>
                    </Wall>
                    <MyFooter/>
                </>
            )}
        </>
    );
};

export default LoginPage;
