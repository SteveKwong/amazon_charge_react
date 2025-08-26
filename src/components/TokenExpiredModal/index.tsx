import React from 'react';
import { Modal, Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface TokenExpiredModalProps {
  visible: boolean;
  onClose: () => void;
}

const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 跳转到登录页
    navigate('/login');
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      width={500}
    >
      <Result
        status="warning"
        title="登录已过期"
        subTitle="您的登录状态已过期，请重新登录以继续使用系统"
        extra={[
          <Button 
            type="primary" 
            key="login" 
            size="large"
            onClick={handleLogin}
            style={{
              borderRadius: 8,
              height: 40,
              padding: '0 24px',
              fontWeight: 500
            }}
          >
            重新登录
          </Button>
        ]}
      />
    </Modal>
  );
};

export default TokenExpiredModal;
