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
		/**
		 * 调用的负责处理的API
		 */
		uploadUrl: '../../../api.php',

		/**
		 * 默认传入文件名
		 */
		uploadFieldName: 'file',

		/**
		 * 下载的文件名，这是替换上传成功后的文件名
		 */
		downloadFieldName: 'file',

		// 只支持这些图片文件
		allowedTypes: [
			'image/jpeg',
			'image/png',
			'image/jpg',
			'image/gif'
		],

		/**
		 * 上传中的文件提醒
		 */
		progressText: '![Uploading file...]()',

		/**
		 * 当成功上传后的文件
		 * {filename} 标签会用来替换为完整的文件名
		 */
		urlText: "![file]({filename})",

		/**
		 * 当通过剪贴板接受到一个文件的事件
		 *
		 * @param {Blob} file
		 */
		onReceivedFile: function(file) {},

		/**
		 * 当成功上传了一个文件的事件
		 *
		 * @param {Object} json JSON data returned from the server
		 */
		onUploadedFile: function(json) {},

		/**
		 * Custom error handler. Runs after removing the placeholder text and before the alert().
		 * Return false from this function to prevent the alert dialog.
		 *
		 * @return {Boolean} when false is returned it will prevent default error behavior
		 */
		customErrorHandler: function() { return true; },

		/**
		 * Custom upload handler, must return false to prevent default handler.
		 * Can be used to send file via custom transport(like socket.io)
		 *
		 * @param {Blob} file
		 * @return {Boolean} when false is returned it will prevent default upload behavior
		 */
		customUploadHandler: function(file) { return true; },

		/**
		 * Error message for default error handler
		 */
		errorText: "Error uploading file"
	}

}