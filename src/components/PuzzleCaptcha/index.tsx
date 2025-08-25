import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, Slider, Space } from 'antd';

type PuzzleCaptchaProps = {
    visible: boolean;
    onClose: () => void;
    onSuccess: (ticket: string) => void;
};

type PuzzleConfig = {
    canvasWidth: number;
    canvasHeight: number;
    pieceSize: number;
    tolerance: number;
};

const defaultConfig: PuzzleConfig = {
    canvasWidth: 310,
    canvasHeight: 155,
    pieceSize: 42,
    tolerance: 6,
};

const getRandomInt = (min: number, max: number) => {
    const ceilMin = Math.ceil(min);
    const floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
};

const drawImageToCanvas = async (imageUrl: string, canvas: HTMLCanvasElement) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('Canvas context not found'));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageUrl;
    });
};

const PuzzleCaptcha: React.FC<PuzzleCaptchaProps> = ({ visible, onClose, onSuccess }) => {
    const config = defaultConfig;
    const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const pieceCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const [loading, setLoading] = useState(false);
    const [targetX, setTargetX] = useState(0);
    const [targetY, setTargetY] = useState(0);
    const [sliderX, setSliderX] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string>('');

    const imagePool = useMemo(() => [
        // 使用项目内现有图片，避免额外依赖
        // 这些路径经由 Webpack/Vite 处理为可访问的 URL
        require('@/components/tee.png'),
        require('@/components/tee2.png'),
        require('@/components/icon.png'),
        require('@/components/icon2.png'),
    ], []);

    const [imageUrl, setImageUrl] = useState<string>('');

    const reset = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const bgCanvas = bgCanvasRef.current;
            const pieceCanvas = pieceCanvasRef.current;
            if (!bgCanvas || !pieceCanvas) return;

            bgCanvas.width = config.canvasWidth;
            bgCanvas.height = config.canvasHeight;
            pieceCanvas.width = config.canvasWidth;
            pieceCanvas.height = config.canvasHeight;

            const img = imagePool[getRandomInt(0, imagePool.length - 1)];
            setImageUrl(img);
            await drawImageToCanvas(img, bgCanvas);

            const x = getRandomInt(config.pieceSize + 10, config.canvasWidth - config.pieceSize - 10);
            const y = getRandomInt(20, config.canvasHeight - config.pieceSize - 10);
            setTargetX(x);
            setTargetY(y);
            setSliderX(0);

            const bgCtx = bgCanvas.getContext('2d');
            const pieceCtx = pieceCanvas.getContext('2d');
            if (!bgCtx || !pieceCtx) return;

            // 绘制背景上“缺口”轮廓（仅描边提示，不真正抠图，简化实现）
            bgCtx.save();
            bgCtx.strokeStyle = 'rgba(255,255,255,0.9)';
            bgCtx.lineWidth = 2;
            bgCtx.setLineDash([6, 4]);
            bgCtx.strokeRect(x, y, config.pieceSize, config.pieceSize);
            bgCtx.restore();

            // 将拼图块绘制到独立画布上（初始在最左侧，x=0）
            pieceCtx.clearRect(0, 0, pieceCanvas.width, pieceCanvas.height);
            // 阴影提升层次
            pieceCtx.save();
            pieceCtx.shadowColor = 'rgba(0,0,0,0.25)';
            pieceCtx.shadowBlur = 8;
            pieceCtx.drawImage(bgCanvas, x, y, config.pieceSize, config.pieceSize, 0, y, config.pieceSize, config.pieceSize);
            pieceCtx.restore();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            reset();
        }
    }, [visible]);

    const handleSlide = (value: number) => {
        setSliderX(value);
        const pieceCanvas = pieceCanvasRef.current;
        const bgCanvas = bgCanvasRef.current;
        if (!pieceCanvas || !bgCanvas) return;
        const ctx = pieceCanvas.getContext('2d');
        if (!ctx) return;

        // 清除并重新绘制拼图块到当前位置 value
        ctx.clearRect(0, 0, pieceCanvas.width, pieceCanvas.height);
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.25)';
        ctx.shadowBlur = 8;
        ctx.drawImage(bgCanvas, targetX, targetY, config.pieceSize, config.pieceSize, value, targetY, config.pieceSize, config.pieceSize);
        ctx.restore();
    };

    const verify = () => {
        if (Math.abs(sliderX - targetX) <= config.tolerance) {
            // 简单生成一个 ticket，用于前端会话内校验
            const ticket = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
            onSuccess(ticket);
        } else {
            setErrorMsg('未对齐，请重试');
        }
    };

    const footer = (
        <Space>
            <Button onClick={reset} disabled={loading}>换一张</Button>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={verify} loading={loading}>验证</Button>
        </Space>
    );

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            title="请完成拼图验证"
            footer={footer}
            destroyOnClose
            width={config.canvasWidth + 48}
            maskClosable={false}
        >
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
                <div style={{position: 'relative'}}>
                    <canvas ref={bgCanvasRef} style={{borderRadius: 8}} />
                    <canvas ref={pieceCanvasRef} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}} />
                </div>
                <div style={{width: config.canvasWidth}}>
                    <Slider
                        min={0}
                        max={config.canvasWidth - config.pieceSize}
                        value={sliderX}
                        onChange={handleSlide}
                        tooltip={{ open: false }}
                    />
                </div>
                {errorMsg && <div style={{color: '#ff4d4f'}}>{errorMsg}</div>}
            </div>
        </Modal>
    );
};

export default PuzzleCaptcha;


