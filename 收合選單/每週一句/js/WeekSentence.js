// 取得當天日期
function getToday() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    return year + "-" + month + "-" + day;
}

// 取得每日一句英文
function getQuote() {
    var quotes = [
        "The best way to predict the future is to create it.",
        "The journey of a thousand miles begins with a single step.",
        "The only way to do great work is to love what you do.",
        "The only thing that is constant is change.",
        "The only thing that is impossible is the thing you don't try.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// 更新每日一句英文
function updateQuote() {
    document.getElementById("quote").innerHTML = getQuote();
    document.getElementById("date").innerHTML = getToday();
}

// 初始化
window.onload = updateQuote;
