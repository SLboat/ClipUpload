/*jslint newcap: true */
/*global XMLHttpRequest: false, inlineAttach: false, FormData: false */
/*
 * Inline Text Attachment
 *
 * Copyright 2012 Roy van Kaathoven.
 * Contact: royvankaathoven@hotmail.com
 *
 * Licensed under the MIT License.
 */
(function(document, window) {
    "use strict";

	/**
	 * Simple function to merge the given objects
	 * 和默认值进行合并，没设置的话就是默认的。。
	 * @param {Object[]} object Multiple object parameters
	 * @returns {Object}
	 */

	function merge() {
		var result = {};
		for (var i = arguments.length - 1; i >= 0; i--) {
			var obj = arguments[i];
			for (var k in obj) {
				result[k] = obj[k];
			}
		}
		return result;
	}

	/**
	 * @param {Object} options
	 */
	window.inlineAttach = function(options, instance) {

		var settings = merge(options, inlineAttach.defaults),
			editor = instance,
			filenameTag = '{filename}',
			lastValue, //最后一次变量
			me = this;

		/**
		 * Upload a given file blob
		 *
		 * @param {Blob} file
		 */
		this.uploadFile = function(file) {
			var formData = new FormData(),
				xhr = new XMLHttpRequest();

			// Attach the file. If coming from clipboard, add a default filename (only works in Chrome for now)
			// http://stackoverflow.com/questions/6664967/how-to-give-a-blob-uploaded-as-formdata-a-file-name
			formData.append(settings.uploadFieldName, file, "image-" + Date.now() + ".png");

			formData.append("action", "upload");
			//保留文件上传提醒-考虑到它是如此的紧要
			//formData.append("ignorewarnings", true);

			//文件名这很重要
			formData.append("filename", settings.filename);
			//引入注释
			formData.append("comment", clipup_vars.comment);
			formData.append("format", "json");
			//token这里是
			formData.append("token", mw.user.tokens.get('editToken'));

			//todo：改写post数据包含更多参数
			xhr.open('POST', settings.uploadUrl);
			xhr.onload = function() {
				// If HTTP status is OK or Created
				if (xhr.status === 200 || xhr.status === 201) {
					var data = JSON.parse(xhr.responseText);
					//触发上传完成事件，回传返回data，传回原始file
					me.onUploadedFile(data, file);
				} else {
					//触发上传错误事件，不返回任何东西
					me.onErrorUploading();
				}
			};
			xhr.send(formData);
		};

		/**
		 * Check if the given file is allowed
		 *
		 * @param {File} file
		 */
		this.isAllowedFile = function(file) {
			return settings.allowedTypes.indexOf(file.type) >= 0;
		};

		/**
		 * When a file has finished uploading
		 *
		 * @param {Object} data
		 */
		this.onUploadedFile = function(data, upload_file) {
			var result = settings.onUploadedFile(data, upload_file);
			var replaceValue = null;
			var filename;
			//检查是否出错
			if (data.error) {
				//进行适当的替换最终错误信息
				replaceValue = settings.mwfeedbackerrorText.replace("%s", data.error.info);
			} else {
				var return_json = data.upload;
				//检查返回状态
				if (return_json.result == "Success") {
					filename = return_json.filename;
					//最终替换值
					replaceValue = settings.urlText.replace(filenameTag, filename);
				} else if (return_json.result == "Warning") {
					var last_waring_name;
					for (var Warning_Type in return_json.warnings) {
						last_waring_name = Warning_Type;
					}
					//这里获得了警告类型
					if (last_waring_name == "duplicate") {
						//写入重复的名称
						filename = return_json.warnings.duplicate[0];
						replaceValue = settings.urlText.replace(filenameTag, filename);
					} else if (last_waring_name == "exists") {
						//已经存在
						filename = return_json.warnings.exists;
						replaceValue = settings.urlText.replace(filenameTag, filename);

					} else { //其他报警信息，只是提示
						replaceValue = settings.failduploadText.replace("%s", last_waring_name);

					}

				}

			}
			if (result !== false && replaceValue) {
				replaceValue += "\n"; //加上多个换行，总是如此
				//交给工厂去代劳
				ink_replace(lastValue,replaceValue);

			}
		};

		/**
		 * Custom upload handler
		 *
		 * @param {Blob} file
		 * @return {Boolean} when false is returned it will prevent default upload behavior
		 */
		this.customUploadHandler = function(file) {
			return settings.customUploadHandler(file);
		};

		/**
		 * When a file didn't upload properly.
		 * Override by passing your own onErrorUploading function with settings.
		 *
		 * @param {Object} data
		 */
		this.onErrorUploading = function() {
			//默认删除一切						
			ink_replace(lastValue,"");	
			if (settings.customErrorHandler()) {
				window.alert(settings.errorText);
			}
		};

		/**
		 * Append a line of text at the bottom, ensuring there aren't unnecessary newlines
		 *
		 * @param {String} appended Current content
		 * @param {String} previous Value which should be appended after the current content
		 */
		//处理空行

		function appendInItsOwnLine(previous, appended) {
			return (previous + "\n\n[[D]]" + appended)
				.replace(/(\n{2,})\[\[D\]\]/, "\n")
				.replace(/^(\n*)/, "");
		}

		/**
		 * When a file has been received by a drop or paste event
		 * @param {Blob} file
		 */
		this.onReceivedFile = function(file) {
			//记录并且设置这里，这里返回一个真值用来保证有效的玩意
			var result = settings.onReceivedFile(file);
			if (result !== false) {
				lastValue = settings.progressText;
				//置入要放入的信息标记，官方的是插入到屁股后面，我们改动回去了wiki的风格
				//editor.setValue(appendInItsOwnLine(editor.getValue(), lastValue));
			}
		};

		/**
		 * Catches the paste event
		 *
		 * @param {Event} e
		 * @returns {Boolean} If a file is handled
		 */
		this.onPaste = function(ev, data) {
			this.onReceivedFile(data.blob);
			
			if (this.customUploadHandler(data.blob)) {
				this.uploadFile(data.blob);
			}
			
			return true;
		};

	};

	/**
	 * Editor
	 */
	window.inlineAttach.Editor = function(instance) {

		var input = instance;

		return {
			getValue: function() {
				return input.value;
			},
			setValue: function(val) {
				input.value = val;
			}
		};
	};

	/**
	 * Default configuration
	 */
	window.inlineAttach.defaults = {
		// URL to upload the attachment
		uploadUrl: 'upload_attachment.php',
		// Request field name where the attachment will be placed in the form data
		uploadFieldName: 'file',
		// Where is the filename placed in the response
		downloadFieldName: 'filename',
		allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],

		/**
		 * Will be inserted on a drop or paste event
		 */
		progressText: '![Uploading file...]()',

		/**
		 * When a file has successfully been uploaded the last inserted text
		 * will be replaced by the urlText, the {filename} tag will be replaced
		 * by the filename that has been returned by the server
		 */
		urlText: "![file]({filename})",

		/**
		 * When a file is received by drag-drop or paste
		 */
		onReceivedFile: function() {},

		/**
		 * Custom upload handler
		 *
		 * @return {Boolean} when false is returned it will prevent default upload behavior
		 */
		customUploadHandler: function() {
			return true;
		},

		/**
		 * Custom error handler. Runs after removing the placeholder text and before the alert().
		 * Return false from this function to prevent the alert dialog.
		 *
		 * @return {Boolean} when false is returned it will prevent default error behavior
		 */
		customErrorHandler: function() {
			return true;
		},

		/**
		 * Text for default error when uploading
		 */
		errorText: "Error uploading file",

		/**
		 * When a file has succesfully been uploaded
		 */
		onUploadedFile: function() {}
	};

	/**
	 * Attach to a standard input field
	 *
	 * @param {Input} input
	 * @param {Object} options
	 */
	window.inlineAttach.attachToInput = function(input, options) {

		options = options || {};

		var editor = new inlineAttach.Editor(input),
			inlineattach = new inlineAttach(options, editor);
		
		$(input).pastableTextarea();
		
		$(input).on('pasteImage', function(ev, data) {
			inlineattach.onPaste(ev, data);
		});

	};

})(document, window);
