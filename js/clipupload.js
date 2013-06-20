var gallery_arr = new Array();

$(document).ready(function() { //jquery      
	/* Check if we are in edit mode and the required modules are available and then customize the toolbar */
	if ($.inArray(mw.config.get('wgAction'), ['edit', 'submit']) !== -1) { //注入工具栏
		//开始注入编辑器
		setup_clipboard();
	}
});

//开始设置剪贴板玩意

function setup_clipboard() {
	//基础api地址
	clipup_vars.debug = clipup_vars.debug || false; //默认为假

	var ClipSetting = {

		base_api_url: 'api.php',

		// 调用的负责处理的API
		uploadUrl: 'api.php',

		filename: 'I_From_CLIP.PNG', //临时的文件名

		// 上传中的文件提醒
		progressText: ':[uploading file...]()\n',

		//当成功上传后的文件，其中{filename} 标签会用来替换为完整的文件名
		urlText: ":[[File:{filename}]]\n",

		// 当通过剪贴板接受到一个文件的事件，参数{Blob}文件,file,size就是文件大小
		onReceivedFile: function(file) {
			var KBSize = Math.round(file.size / 1024);
			if (!clipup_vars.debug){
				//获得一个文件名-独一无二的
				this.filename = getTimeFileName();
			}
			//检查文件大小
			if (CheckFileSize(file.size)) {
				//显示工具栏提示
				this.progressText = (":[Clip_Upload:File has too large: " + KBSize + "KB!]\now");
				//文件太大了，加以提醒
			} else {
				//这里会被预先处理
				this.progressText = ":[Clip_Upload:Uploading file:" + this.filename + "(" + KBSize + "KB)]...\n";
			}
			ink_go(this.progressText);
			return true;
		},
		onErrorUploading: function(return_json) {
			mw_inserttag("\n:[Clip_Upload:Faild to upload]")
		},

		// 当成功上传了一个文件的事件 参数{Object} json 返回服务器返回来的json数据
		onUploadedFile: function(return_json) {},

		//上传前处理文件是否可以上载
		customUploadHandler: function(file) {
			//检查文件够大不
			return !CheckFileSize(file.size);

		}

	}

	//绑定设置
	inlineAttach.attachToInput(document.getElementById("wpTextbox1"), ClipSetting);

}

/* 森亮号文件名获得函数
 * 作用：获得一个文件名标记的时间
 * 效果：得到的文件名类似Clip_Cap_2013-1-3_23.26.13_0.PNG
 * 参数：传入参数file_index为所在的文件序号
 */

function getTimeFileName(file_index) {
	if (typeof(file_index) == "undefined") {
		file_index = ""; // 未定义的时候得到空白
	} else {
		file_index = "_" + file_index;
	}
	// 文件名后缀，暂时只处理jpg，因为ios6的相册都是jpg
	var file_ext = ".PNG";
	//获得时间串
	var timestr = get_format_date("yyMMdd_hhmmss");
	//得到最终的新文件名
	return "ClipCapIt_" + "_" + timestr + file_ext
}

//插入到当前编辑框

function mw_inserttag(str) {
	mw.toolbar.insertTags(str, '', '')
}

//检查文件大小，传入完整比特单位的filesize

function CheckFileSize(filesize) {
	return (filesize > clipup_vars.maxfilesize * 1024);
}

//获得格式化的日期
get_format_date = function(format) {
	/* 
	 * format="yyyy-MM-dd hh:mm:ss";
	 */
	format = format || "yyyy-MM-dd hh:mm:ss";
	var now = new Date();

	var o = {
		"M+": now.getMonth() + 1,
		"d+": now.getDate(),
		"h+": now.getHours(),
		"m+": now.getMinutes(),
		"s+": now.getSeconds(),
		"q+": Math.floor((now.getMonth() + 3) / 3),
		"S": now.getMilliseconds()
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (now.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

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
        var curr_pos = 1; //光标坐标，换行了，第一个开始
    
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
    
    if (curr_pos > -1) 
    {
        mousePos = startPos + curr_pos; //传入位置+漂移
    } else {
        mousePos = startPos + ink.length; //初始化位置+长度
    }
    
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