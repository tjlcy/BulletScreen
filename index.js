// 初始化
var bulletScreenContainer = document.getElementById("text-container"); //放置弹幕的容器
var bulletScreenWidth = bulletScreenContainer.clientWidth; //获取放弹幕的容器的宽度
var bulletLine = 16; //弹幕行数（Max）
var bulletHeight = 30; //每行弹幕的高度
var CurrentLine = 0; //当前行
/**
 * @param {*} 创建弹幕
 * @param {*} content 弹幕的内容
 * @param {*} color   弹幕的颜色
 */
function bulletScreen(content, color) {
    var span = document.createElement("span"); //创建每个弹幕的容器
    bulletScreenContainer.appendChild(span); //将每个弹幕放到弹幕区域中
    span.innerText = content; //弹幕内容根据数据显示在页面中
    span.style.color = color; //弹幕颜色根据数据设置相应的颜色
    // 弹幕位置初始化
    // 水平
    var left = bulletScreenWidth;
    span.style.left = left + "px";
    // 垂直
    var top = bulletHeight * CurrentLine;
    span.style.top = top + "px";
    // 当前行变化
    // CurrentLine++; 错误 会出现超出行数范围的情况
    CurrentLine = (CurrentLine + 1) % bulletLine;
    // 写法2：
    // if (CurrentLine === bulletLine) {
    //     CurrentLine = 0;
    // }
    // 设置弹幕的速度（随机）
    span.speed = getRandom(100, 301); //左闭右开
    // 存储初始值
    span.left = left;
    span.width = span.clientWidth;
};
// 获取随机速度
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
var timer = null; //定时器id初始化
// 弹幕移动
function Move() {
    // 如果timer有值
    if (timer) {
        // 已经在移动了
        return;
    }
    var duration = 14; //时间初始化
    timer = setInterval(function() {
        // 遍历弹幕标签
        for (var i = 0; i < bulletScreenContainer.children.length; i++) {
            var span = bulletScreenContainer.children[i];
            span.left -= (span.speed * duration) / 1000; //s=vt  1秒 = 1000毫秒
            span.style.left = span.left + "px"; //把新的位置应用到元素上
            // 超出边缘移除span
            if (span.left <= -span.width) {
                span.remove();
                i--;
            }
        }
    }, duration);

};
// 弹幕暂停
function Stop() {
    // 清除定时器
    clearInterval(timer);
    // 让定时器回到初始状态
    timer = null;
};
// 弹幕清空
function Clear() {
    // 弹幕内容清空
    bulletScreenContainer.innerHTML = '';
    // 当前行回到初始值
    CurrentLine = 0
};
var video = document.getElementById("video"); //绑定视频
// 视频播放时，弹幕移动
video.onplay = function() {
    Move();
};
// 视频暂停时，弹幕暂停
video.onpause = function() {
    Stop();
};
var lastCreateTime = -1; //上次创建弹幕的时间点初始化
// 视频当前位置改变时，弹幕出现
video.ontimeupdate = function() {
    // 判断弹幕状态（开启/关闭）
    if (isClose) {
        // 如果弹幕已关闭，不再创建
        return;
    };
    var currentTime = parseInt(video.currentTime); //当前时间初始化
    // 判断是否拖动
    if (Math.abs(currentTime - lastCreateTime) > 1) {
        Clear();
    };
    // 判断这个时间点的弹幕是否创建过
    if (currentTime === lastCreateTime) {
        // 这个时间点的弹幕已经创建过了，不需要重新创建
        return;
    }
    for (var i = 0; i < danmu.length; i++) {
        var d = danmu[i];
        if (d.time === currentTime) {
            bulletScreen(d.content, d.color);
        } else if (d.time > currentTime) {
            break;
        }
    }
    lastCreateTime = currentTime;
};
var btn = document.getElementById("toggle"); //绑定按钮
var isClose = false; //弹幕默认开启状态
// 按钮点击时，切换弹幕的状态（开启/关闭）
btn.onclick = function() {
    // 判断弹幕是否关闭
    if (isClose) {
        isClose = false;
    } else {
        isClose = true;
        Clear(); //关闭弹幕，清空弹幕
    }

}