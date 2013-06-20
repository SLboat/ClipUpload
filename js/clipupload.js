var gallery_arr = new Array();

$(document).ready(function () { //jquery      
/* Check if we are in edit mode and the required modules are available and then customize the toolbar */
if ( $.inArray( mw.config.get( 'wgAction' ), ['edit', 'submit'] ) !== -1 ) {	//注入工具栏
	//开始注入编辑器
}
});

//开始设置剪贴板玩意
function setup_clipboard(){
	var ClipSetting={
			// 调用的负责处理的API
			uploadUrl: '../../api.php',

			// 上传中的文件提醒
			progressText: '![上传文件中 file...]()',

			//当成功上传后的文件，其中{filename} 标签会用来替换为完整的文件名
			urlText: "[[{filename}]]",

			// 当通过剪贴板接受到一个文件的事件，参数{Blob}文件,file,size就是文件大小
			onReceivedFile: function(file) {
				this.progressText='[[正在上传...文件大小:'+ parseInt(file.size/1000) +'K]]';
				this.uploadUrl += "?file=hi";
			},

			// 当成功上传了一个文件的事件 参数{Object} json 返回服务器返回来的json数据
			onUploadedFile: function(json) {},
		}

		//绑定设置
		inlineAttach.attachToInput(document.getElementById("wpTextbox1"),ClipSetting);

}

/* 森亮号文件名获得函数
* 作用：获得一个文件名标记的时间
* 效果：得到的文件名类似Clip_Cap_2013-1-3_23.26.13_0.PNG
* 参数：传入参数file_index为所在的文件序号
*/
function getTimeFileName(file_index){
	if (typeof(file_index) == "undefined")
	{
		file_index = 0; // 未定义的时候得到0 
	}
	// 文件名后缀，暂时只处理jpg，因为ios6的相册都是jpg
	var file_ext = ".PNG"; 
	//得到一个新的时间类
	var now = new Date(); 
	//获得日期串
	var datastr = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate(); 
	//获得时间串
	var timestr = now.getHours() + "." + now.getMinutes() + "." + now.getSeconds();
	//得到最终的新文件名
	return "Clip_Cap_" + datastr +"_" + timestr +"_" + file_index + file_ext
}