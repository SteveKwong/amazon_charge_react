# DetailButton 详情按钮组件

## 功能描述

DetailButton 是一个专门为详情查看功能设计的按钮组件，具有美观的样式和丰富的交互效果。

## 特性

- **美观的样式**: 蓝色边框，圆角设计，阴影效果
- **悬停效果**: 鼠标悬停时背景变蓝色，字体变白色
- **动画效果**: 悬停时轻微上浮，阴影加深
- **响应式设计**: 支持自定义样式和类名
- **黑体字体**: 使用黑体字体，更加醒目

## 使用方法

```tsx
import DetailButton from '@/components/DetailButton';

// 基本使用
<DetailButton onClick={() => handleViewDetail(record)} />

// 自定义文字
<DetailButton onClick={() => handleViewDetail(record)}>
    查看详情
</DetailButton>

// 自定义样式
<DetailButton 
    onClick={() => handleViewDetail(record)}
    className="custom-detail-btn"
    style={{ marginLeft: '10px' }}
/>
```

## 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `onClick` | `() => void` | - | 点击事件处理函数，必需 |
| `children` | `React.ReactNode` | '详情' | 按钮文字内容 |
| `className` | `string` | - | 自定义CSS类名 |
| `style` | `CSSProperties` | - | 自定义内联样式 |

## 样式特点

- **尺寸**: 高度36px，内边距20px
- **字体**: 14px，黑体，字重600
- **颜色**: 默认蓝色边框和文字，悬停时蓝色背景白色文字
- **圆角**: 8px圆角
- **阴影**: 默认浅蓝色阴影，悬停时深蓝色阴影
- **动画**: 悬停时上浮2px，过渡时间0.3秒

## 悬停效果

- **背景色**: 从透明变为蓝色 (#1890ff)
- **文字色**: 从蓝色变为白色 (#ffffff)
- **边框色**: 保持蓝色 (#1890ff)
- **阴影**: 从浅蓝色变为深蓝色
- **位置**: 轻微上浮2px

## 注意事项

1. 确保项目中已安装SASS依赖
2. 组件使用CSS类名管理样式，支持样式覆盖
3. 默认使用黑体字体，确保字体文件可用
4. 悬停效果通过CSS实现，性能良好
