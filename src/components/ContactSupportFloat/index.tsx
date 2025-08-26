import React, {useState} from "react";
import {FloatButton, Modal, Image, Typography} from "antd";

type ContactSupportFloatProps = {
    qrSrc?: string;
    title?: string;
};

const ContactSupportFloat: React.FC<ContactSupportFloatProps> = ({
    qrSrc = "/qr-cs.png",
    title = "添加客服联系",
}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 24, bottom: 24 }}
                description={title}
                onClick={() => setOpen(true)}
              />
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                title={title}
            >
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                    <Image
                        src={qrSrc}
                        alt={title}
                        width={260}
                        preview={false}
                        fallback={qrSrc}
                        style={{borderRadius: 8}}
                    />
                    <Typography.Text type="secondary">请使用微信/手机扫码添加客服</Typography.Text>
                </div>
            </Modal>
        </>
    );
};

export default ContactSupportFloat;




