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
				this.progressText = (":[Clip_Upload:File has too large: " + KBSize + "KB!]");
				//文件太大了，加以提醒
			} else {
				//这里会被预先处理
				this.progressText = ":[Clip_Upload:Uploading file:" + this.filename + "(" + KBSize + "KB)...]";
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
