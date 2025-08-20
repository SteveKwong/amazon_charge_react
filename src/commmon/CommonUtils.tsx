// src/utils/common.ts

// 示例函数：格式化日期
export function formatDate(date: Date, separator: string = '-') {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${separator}${month}${separator}${day}`;
}

// 示例函数：生成随机ID
export function randomId(length: number = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^1[3-9]\d{9}$/; // 中国手机号正则

export function getInputPattern(username: string) {
    // 在提交前先进行自定义的正则校验
    if (emailPattern.test(username)) {
        return 'email'
    } else if (phonePattern.test(username)) {
        return 'phone'
    } else {
        return '格式不正确';
    }
}


// 还可以用默认导出一个对象
const CommonUtils = {
    formatDate,
    randomId
};

export default CommonUtils;
