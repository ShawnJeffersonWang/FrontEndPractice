// 公司需要怎样的人才？需要解决问题的人，轮播图，二级菜单，手风琴一定会用现成的，不会让你手写
// 做的所有效果一定不会用，那为什么不教以后公司一定要用到的呢？
// 因为没有任何人知道公司以后一定会用啥，如果能确定公司以后要用啥，那个玩意一定会做成产品和库，形成产品就不需要开发了
// 为什么要找前端开发，就是因为没有现成的，每个公司有自己独特的需求，开发实际上是一个创作性的工作，编程是一门艺术
// 做过这个做过那个不表示你您，而是表现你有创造的能力，也就是解决问题的能力，在创造过程中一定会遇到各种各样的问题，而且没有见过
// 看中的就是这个能力，他也不知道给你什么样的任务

// no从界面切入，切入点永远是数据
// lrc这个字符串不好用,无法操作，最好是一个数组，这么多数组该是数组
// 浏览器渲染原理的第一步
// html -> 对象，也是因为变成对象结构就好操作了

// console.log(lrc);

// 对象，数组
// clg
// 每句歌词是字符串的话也不好用, 是复合数据, 应该是对象
// {time: 1.06, words: '...'},

/**
 * /**开头叫文档注释：好处是，将来调用函数时指着这个函数有提示
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象: {time: 开始时间, words: 歌词内容}
 */
function parseLrc() {
    var lines = lrc.split('\n')
    var result = [];
    for (var i = 0; i < lines.length; i++) {
        var str = lines[i];
        var parts = str.split(']');
        // HTML搞定大div后搞定小div，JS也是，整体 -> 局部 -> 细节
        var timeStr = parts[0].substring(1);
        // 为了保证每一个函数的结构简洁，单写一个函数
        var obj = {
            time: parseTime(timeStr),
            words: parts[1],
        }
        // console.log(str);
        result.push(obj);
    }
    return result;
}

/**
 * 将一个时间字符串解析为数字（秒）
 * @param {String} timeStr 时间字符串
 * @returns 
 */
function parseTime(timeStr) {
    var parts = timeStr.split(':');
    // 出现算术运算符就会转成数字，转不出来就是NaN
    // console.log(+parts[0] * 60 +
    //     +parts[1]);
    return +parts[0] * 60 + +parts[1];
}

// 保存到一个变量里，待以后使用
// 一开始不应该先做界面，应该先做功能和需求，也就是先做函数和对象，做好之后界面极其简单
var lrcData = parseLrc();

// 获取需要的 dom
// 为什么要写对象，如果定义一大堆的变量，变量多了，容易导致变量名冲突
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
};

/**
 * 计算出，在当前播放器播放到第几秒的情况
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 */
// 心智负担，写完函数，测试完了，就不要再想了，就当这个函数是天生存在的，就像这个函数是浏览器写好的一样
// 就像调用console.log()的时候，我们没有想这个函数里面是啥，这也是封装的思想的很重要的一部分
// 这才是开发程序，不要一开始就做界面，先写好基础功能，写完函数一定要测试，要不然后面调这个函数的时候你不知道是函数的问题还是现在的问题
// 写代码就像搭积木一样，学程序不能抄
function findIndex() {
    // console.log(doms.audio.currentTime);
    // 播放器当前时间
    var curTime = doms.audio.currentTime;
    // console.log(lrcData);
    // 你是怎么找的程序就是怎么找的
    for (var i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }
    // 找遍了都没找到（说明播放到最后一句）
    return lrcData.length - 1;
}

// 界面

/**
 * 创建歌词元素 li
 * 打字速度也不重要，因为大部分时间是在想问题
 */
function createLrcElements() {
    // 文档片段, 知道他而没用他，和你完全不知道他而没用他完全是两码事
    var frag = document.createDocumentFragment();
    for (var i = 0; i < lrcData.length; i++) {
        var li = document.createElement('li')
        li.textContent = lrcData[i].words;
        // 改动了dom树，考虑效率问题需要找到平衡,当出现效率问题的时候才优化，永远不要率先优化！
        // doms.ul.appendChild(li);
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

// 容器高度
var containerHeight = doms.container.clientHeight;
// 避免写死，样式变化代码不用改 出现写死的地方叫hard code(硬编码)，尽量避免,->高内聚，低耦合
var liHeight = doms.ul.children[0].clientHeight;
// 建议写出去，ul的高度，获取尺寸位置的几何信息，会导致reflow
// 最大偏移量
var maxOffset = doms.ul.clientHeight - containerHeight;
// 先数据逻辑->再界面逻辑->事件
// 之后只需要做连线就行了

/**
 * 设置ul元素的偏移量
 */
function setOffset() {
    var index = findIndex();
    var offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    // var h1 = liHeight * index + liHeight / 2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }
    // 往上偏移是负数
    // doms.ul.style.transform = 'translateY(-?px)'
    // ES6
    doms.ul.style.transform = `translateY(-${offset}px)`

    // 去掉之前的active样式
    var li = doms.ul.querySelector('.active');
    if (li) {
        // H5的做法
        li.classList.remove('active');
    }

    // doms.ul.children[index].className = 'active';
    var li = doms.ul.children[index];
    if (li) {
        doms.ul.children[index].classList.add('active');
    }
}

// 不要写setOffset()，这是调用setOffset函数，把返回值作为第2个参数
doms.audio.addEventListener('timeupdate', setOffset);
