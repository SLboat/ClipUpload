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

	var ClipSetting = {

		base_api_url: 'api.php',

		// 调用的负责处理的API
		uploadUrl: 'api.php',

		// 上传中的文件提醒
		progressText: ':[uploading file...]()\n',

		//当成功上传后的文件，其中{filename} 标签会用来替换为完整的文件名
		urlText: ":[[file:{filename}]]\n",

		// 当通过剪贴板接受到一个文件的事件，参数{Blob}文件,file,size就是文件大小
		onReceivedFile: function(file) {
			var KBSize = Math.round(file.size / 1024);
			//检查文件大小
			if (CheckFileSize(file.size)) {
				//显示工具栏提示
				this.progressText = (":[Clip_Upload:File has too large: " + KBSize + "KB!]");
				//文件太大了，加以提醒
			} else {	
				//这里会被预先处理
				this.progressText = ':[Clip_Upload:Uploading for(' + KBSize + 'KB)]\n';				
			}
			return true;
		},
		onErrorUploading: function(return_json){
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
		file_index = 0; // 未定义的时候得到0 
	}
	// 文件名后缀，暂时只处理jpg，因为ios6的相册都是jpg
	var file_ext = ".PNG";
	//得到一个新的时间类
	var now = new Date();
	//获得日期串
	var datastr = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
	//获得时间串
	var timestr = now.getHours() + "." + now.getMinutes() + "." + now.getSeconds();
	//得到最终的新文件名
	return "Clip_Cap_" + datastr + "_" + timestr + "_" + file_index + file_ext
}

//插入到当前编辑框

function mw_inserttag(str) {
	mw.toolbar.insertTags(str, '', '')
}

//检查文件大小，传入完整比特单位的filesize

function CheckFileSize(filesize) {
	return (filesize > clipup_vars.maxfilesize * 1024);
}