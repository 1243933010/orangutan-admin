export const convertTimestampToDateString=(timestamp)=> {
    // 将十位数时间戳转换为毫秒级时间戳
    var date = new Date(timestamp * 1000);

    // 获取年、月、日
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并保证两位数格式
    var day = ('0' + date.getDate()).slice(-2); // 保证两位数格式

    // 拼接成年月日字符串
    var dateString = year + '-' + month + '-' + day;

    return dateString;
}
