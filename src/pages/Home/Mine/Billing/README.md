# 账单页面功能说明

## 功能概述
账单页面提供了用户余额、收入提现统计等财务管理功能。

## 主要功能

### 1. 余额显示
- 显示当前账户余额
- 支持余额隐藏/显示切换
- 提供充值和提现快捷操作

### 2. 当月统计
- **当月收入**: 显示当月总收入金额
- **当月提现**: 显示当月总提现金额
- **同比变化**: 显示与上月的百分比变化（带上升/下降箭头）

### 3. 收入提现统计图表
- **时间范围选择**: 用户可以选择年月范围查看统计数据
- **图表类型切换**: 支持收入统计和提现统计两种视图
- **数据刷新**: 提供手动刷新按钮
- **响应式图表**: 基于ECharts的交互式图表

### 4. 收支清单
- 详细的收支记录表格
- 支持分页和搜索
- 显示交易类型、金额、描述、分类、支付方式、日期等信息

## 接口集成

### API接口
- **接口地址**: `GET /jinx/rechargeOrder/userDisplayBalanceIneStatistics`
- **参数**: 
  - `startMonth`: 开始月份 (格式: YYYY-MM)
  - `endMonth`: 结束月份 (格式: YYYY-MM)
- **响应数据**:
  ```json
  {
    "msg": "success",
    "code": 200,
    "userDisplayBalanceIneStatistics": {
      "balance": 0.00,
      "monthly_income": 0,
      "compared_with_last_month_expenditure": "+0%",
      "monthly_expenditure": 0,
      "compared_with_last_month_income": "+0%",
      "list_income_withdrawal_statistics": [
        {
          "expenditure_money": 0,
          "income_money": 0,
          "month": "2021-01"
        }
      ]
    }
  }
  ```

### 数据映射
- `balance` → 账户余额
- `monthly_income` → 当月收入
- `monthly_expenditure` → 当月提现
- `compared_with_last_month_income` → 收入同比变化
- `compared_with_last_month_expenditure` → 提现同比变化
- `list_income_withdrawal_statistics` → 图表数据

## 使用说明

### 时间范围选择
1. 点击图表右上角的时间选择器
2. 选择开始月份和结束月份
3. 系统自动刷新数据并更新图表

### 图表操作
1. 点击"收入"或"提现"按钮切换图表类型
2. 点击"刷新"按钮手动更新数据
3. 鼠标悬停图表查看详细数据

### 提现操作
1. 点击"提现"按钮
2. 选择提现方式（微信/支付宝）
3. 输入提现金额和收款账号
4. 确认提现申请

## 技术实现

### 依赖库
- React 18
- TypeScript
- Ant Design 5
- ECharts
- Axios
- Day.js

### 主要组件
- `MyBillingPage`: 主页面组件
- `EChart`: 图表组件
- `RightActionBar`: 右侧操作栏

### 状态管理
- 使用React Hooks管理组件状态
- 支持数据加载状态显示
- 错误处理和用户提示

## 样式特点
- 现代化UI设计
- 渐变背景和动画效果
- 响应式布局
- 统一的色彩主题
