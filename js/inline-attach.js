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
            formData.append("ignorewarnings", true);
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
                    //触发上传完成事件，回传返回data
                    me.onUploadedFile(data);
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
        this.onUploadedFile = function(data) {
            var result = settings.onUploadedFile(data),
                filename = data.upload.filename;
            if (result !== false && filename) {
                var replaceValue = settings.urlText.replace(filenameTag, filename);
                var editor_ink = ink_get_editor();
                var mousePos = editor_ink.selectionStart + (replaceValue.length - lastValue.length);
                //替换回去剪贴板文件，替换记录着的上次文件
                var text = editor.getValue().replace(lastValue, replaceValue);
                //把已经替换过的文本放入进去
                editor.setValue(text);
                //把光标放到背后
                editor_ink.selectionStart = mousePos;
                editor_ink.selectionEnd = mousePos;

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
            var text = editor.getValue().replace(lastValue, "");
            editor.setValue(text);
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
        this.onPaste = function(e) {
            var result = false,
                clipboardData = e.clipboardData;

            if (typeof clipboardData === "object" && clipboardData.items !== null) {
                //todo: 只处理一个文件
                for (var i = 0; i < clipboardData.items.length; i++) {
                    var item = clipboardData.items[i];
                    if (me.isAllowedFile(item)) {
                        result = true;
                        this.onReceivedFile(item.getAsFile());
                        if (this.customUploadHandler(item.getAsFile())) {
                            this.uploadFile(item.getAsFile());
                        }
                    }
                }
            }


            return result;
        };

        /**
         * Catches onDrop event
         *
         * @param {Event} e
         * @returns {Boolean} If a file is handled
         */
        this.onDrop = function(e) {
            var result = false;
            for (var i = 0; i < e.dataTransfer.files.length; i++) {
                var file = e.dataTransfer.files[i];
                if (me.isAllowedFile(file)) {
                    result = true;
                    this.onReceivedFile(file);
                    if (this.customUploadHandler(file)) {
                        this.uploadFile(file);
                    }
                }
            }

            return result;
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
        allowedTypes: [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/gif'
        ],

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

        input.addEventListener('paste', function(e) {
            inlineattach.onPaste(e);
        }, false);
        /* remove this function
        input.addEventListener('drop', function(e) {
            e.stopPropagation();
            e.preventDefault();
            inlineattach.onDrop(e);
        }, false);
        input.addEventListener('dragenter', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        input.addEventListener('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        }, false);
        */
    };

})(document, window);