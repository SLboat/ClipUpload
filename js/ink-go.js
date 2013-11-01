//引入自森亮号航海见识墨水，可能稍有改动-比如去掉了currpos
//todo:全部转录改成工厂模式

//todo:由于有点混乱,准备和类的编辑器附加代码合并成一个单独的库

//处理mw的文字
var mw_editor; //全局的mw编辑器
//封装成子函数多好

//获得光标之前的文字

function ink_before_text() {
    var editor = ink_get_editor();
    var startPos = editor.selectionStart;
    return editor.value.substring(0, startPos);
}

//获得光标之后的文字

function ink_after_text() {
    var editor = ink_get_editor();
    var endPos = editor.selectionEnd;
    return editor.value.substring(endPos, editor.value.length);
}

//获得全部的文字

function ink_all_text() {
    var editor = ink_get_editor();
    var startPos = editor.selectionEnd;
    return editor.value;
}

//获得编辑器，可以缓存
//使用它的value可以直接获得内容-多老的发现啊

function ink_get_editor() {
    //写全局变量
    if (typeof(mw_editor) == "undefined") {
        return document.getElementById('wpTextbox1');
    } else
        return mw_editor; //返回缓存的玩意
}

//是否在新行

function ink_is_in_newline() {
    //如果有换行符号那就是了
    if (ink_before_text().length == 0) {
        return true; //第一个，通过
    }
    return ink_before_text()[ink_before_text().length - 1].search(/[\r\n]/) > -1;

}

//开始摆弄墨水，逻辑简单化，这里只处理普通墨水，其他的自己折腾去

function ink_go(ink) {

    var curr_pos = 0; //光标坐标
    var br = "\n"; //br字符

    if (ink_get_editor() == null) //无效编辑器
    {
        return false; //回家
    }

    /* 在来考虑换行好吧 */
    if (!ink_is_in_newline()) {
        ink = br + ink;
    }
    /* 好了，送入墨水 */
    ink_inject(ink, curr_pos);

}

//当前光标写入文字

function ink_inject(ink, curr_pos) {
    var editor = ink_get_editor();
    //save textarea scroll position
    var textScroll = editor.scrollTop;
    //清空标记
    var tagClose = "";
    var mousePos = 0; //光标位置处理

    //get current selection
    editor.focus();

    var startPos = editor.selectionStart;
    var endPos = editor.selectionEnd;

    mousePos = startPos + ink.length + curr_pos; //初始化位置+长度

    selText = editor.value.substring(startPos, endPos);

    //插入标签？
    if (selText.charAt(selText.length - 1) == ' ') { //排除末尾的空白符号
        //如果最后一个选择的文字不是空格，就加上空格，真奇怪，好像是把空格移走了
        selText = selText.substring(0, selText.length - 1);
        tagClose += ' ';
    }

    editor.value = ink_before_text() + ink + selText + tagClose + ink_after_text();

    //把光标放到背后
    editor.selectionStart = mousePos;
    editor.selectionEnd = mousePos;

    //恢复滚动体位置
    //editor.scrollTop = textScroll;
}

//替换一个内容，并且把关标服侍的好好的
//这里这处理第一个匹配内容-遗憾的
function ink_replace(search_str, replace_str) {
    var editor = ink_get_editor();
    var mousePos = editor.selectionStart; //默认位置就是当前
    //记下上次位置，记忆
    var lastValue_Pos = editor.value.search(escape_from_regexp(search_str));
    //回忆上次位置，看看是否需要变化
    if (editor.selectionStart > lastValue_Pos) {
        //todo:考虑如果在字符中间？
        var mousePos = editor.selectionStart + (replace_str.length - search_str.length);
    }

    //替换回去剪贴板文件，替换记录着的上次文件
    //todo:逃离这里？做逃离替换串处理？
    var text = editor.value.replace(search_str, replace_str);

    //把已经替换过的文本放入进去
    editor.value = text;

    //把光标放到背后
    editor.selectionStart = mousePos;
    editor.selectionEnd = mousePos;
    //Todo:处理滚动条？
}

/* 模式子串逃跑函数
 * 作用：让模式子串的样子串变得可以随意被search等强制模式的函数认识
 * 试试看：escape_from_regexp("[s")
 * 可用性："[sssa".search(escape_from_regexp("[ss"))
 * 参考自 http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
 */

function escape_from_regexp(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

//交给主脚本去处理事件钩子，到这里结束


