var last_file_size = 0; //上次文件大小

$(document).ready(function() { //jquery      
	/* Check if we are in edit mode and the required modules are available and then customize the toolbar */
	if ($.inArray(mw.config.get('wgAction'), ['edit', 'submit']) !== -1) { //注入工具栏
		//开始注入编辑器
		work_clipboard();
	}
});

//开始设置剪贴板玩意

function work_clipboard() {

	var ClipSetting = {

		//基础api地址
		base_api_url: "api.php",

		// 调用的负责处理的API
		uploadUrl: "api.php",

		filename: "I_From_CLIP.PNG", //临时的文件名

		// 上传中的文件提醒
		progressText: mw.msg("clipup-progressText"),

		// 上传失败的提醒
		failduploadText: mw.msg("clipup-failduploadText"),

		//得到了错误的返回的时候
		mwfeedbackerrorText: mw.msg("clipup-mwfeedbackerrorText"),

		//当成功上传后的文件，其中{filename} 标签会用来替换为完整的文件名
		urlText: mw.msg("clipup-urlText").replace("%s", "{filename}"),

		// 当通过剪贴板接受到一个文件的事件，参数{Blob}文件,file,size就是文件大小
		onReceivedFile: function(file) {
			var KBSize = Math.round(file.size / 1024);
			//检查文件大小
			if (typeof(clipup_vars) == "undefined") {
				//不存在配置变量
				this.progressText = mw.msg("clipup-notLoadConfig");
				//既然都要死亡,或许加个[this.faild]?
			} else if (file.size == last_file_size) {
				//和上次一样不传
				this.progressText = mw.msg("clipup-notsamesize");
			} else if (CheckFileSize(file.size)) {
				//显示工具栏提示
				this.progressText = mw.msg("clipup-istoolarge").replace("%s", KBSize);
				//文件太大了，加以提醒
			} else { //一切顺利-来到了这里
				//文件名处理-这类一切看起来都好
				if (clipup_vars.debug) //If undefined should be faild too
					this.filename = "I_From_CLIP.PNG"; //调试文件名称
				else {
					//获得一个文件名-独一无二的
					this.filename = getTimeFileNameByClip();
				}
				//这里会被预先处理
				this.progressText = mw.msg("clipup-uploadingText").replace("%s", this.filename).replace("%s", KBSize)

			}
			this.progressText += "\n"; //加上回车收尾
			ink_go(this.progressText);
			return true;
		},
		onErrorUploading: function(return_json) {
			//未做具体处理
			mw_inserttag(mw.msg("clipup-errdoingupload"))
		},

		//当成功上传了一个文件的事件 参数{Object} json 返回服务器返回来的json数据
		onUploadedFile: function(return_json, file) {

			return true;

		},

		//上传前处理文件是否可以上载
		customUploadHandler: function(file) {
			if (typeof(clipup_vars) == "undefined") {
				//没有配置信息
				return false;
			} else if (file.size == last_file_size) {
				//文件大写一样不传
				return false;
			}
			//检查文件够大不-最后的检查
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

function getTimeFileNameByClip(file_index) {
	if (typeof(file_index) == "undefined") {
		file_index = ""; // 未定义的时候得到空白
	} else {
		file_index = "-" + file_index;
	}
	// 文件名后缀，暂时只处理jpg，因为ios6的相册都是jpg
	var file_ext = ".PNG";
	//获得时间串
	var timestr = get_format_date("yyMMdd-hhmmss");
	//得到最终的新文件名，前缀加连接字符等玩意构成了最终的小玩意
	return "ClipCapIt" + "-" + timestr + file_ext
}

//插入到当前编辑框

function mw_inserttag(str) {
	mw.toolbar.insertTags(str, "", "")
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