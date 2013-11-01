//引入自森亮号航海见识墨水，可能稍有改动-比如去掉了currpos

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
function ink_get_editor() {
    //写全局变量
    if (typeof (mw_editor) == "undefined") 
    {
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
    var br = "\n";//br字符
    
    if (ink_get_editor() == null)  //无效编辑器
    {
        return false; //回家
    }
    
    /* 在来考虑换行好吧 */
    if (!ink_is_in_newline()) 
    {
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
    
    editor.value = ink_before_text() 
    + ink + selText + tagClose 
    + ink_after_text();

    //把光标放到背后
    editor.selectionStart = mousePos;
    editor.selectionEnd = mousePos;

//恢复滚动体位置
//editor.scrollTop = textScroll;
}

//交给主脚本去处理事件钩子，到这里结束