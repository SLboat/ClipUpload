<?php
/**
 * Internationalisation file for extension ClipUpload.
 *  
 * @author SLboat
 *
 * @licence GNU General Public Licence 2.0 or later
 */
 
$messages = array();
 
/** English 
 * @author SLboat
 */
$messages['en'] = array(
		'clipup-desc' => 'Quick Uplaod use ClipBoard,base on InlineAttachment',
        'clipup-progressText' => ':[Clip_Upload:uploading file...]()',
        'clipup-failduploadText' => ':[Clip_Upload:upload faild(%s)]',
        //please dont translate inside the flag%s,is will be replace some other text
        'clipup-uploadingText' => ':[Clip_Upload:Uploading %s(%sKB)...]',
        'clipup-urlText' => ':[[File:{filename}]]', #替换后的URL地址
        'clipup-notsamesize' => ':[Clip_Upload:Clip has same]', #不一样大小提示
        'clipup-filehastoolarge' => ':[Clip_Upload:File has too large: %sKB!]', #文件太大了
        'clipup-errdoingupload' => ':[Clip_Upload:Error to upload]', #上传的时候发生意外
        'clipup-mwfeedbackerrorText' => '[Clip_Upload:Error Upload From Server(%s)]',

);


/** Chinese Simplified 
 * 中文简体，啊哈
 * @mod 森亮号大船
 */
$messages['zh-hans'] = array(
		'clipup-desc' => '快速从剪贴板获取上传内容,基于伟大的InlineAttachment',
        'clipup-progressText' => ':[剪贴板上传:上传文件中...]()', #这里基本可以忽略，会被很快覆盖掉
        'clipup-failduploadText' => ':[剪贴板上传: 上传失败(%s)]',
        //please dont translate inside the flag%s,is will be replace some other text
        'clipup-uploadingText' => ':[剪贴板上传: 正在上传 %s(%sKB)...]',
        'clipup-urlText' => ':[[文件:%s]]', #替换后的URL地址
        'clipup-notsamesize' => ':[剪贴板上传:剪贴板内容一样]', #不一样大小提示
        'clipup-filehastoolarge' => ':[剪贴板上传: 剪贴板里的图片太大了-%sKB!]', #文件太大了
        'clipup-errdoingupload' => ':[剪贴板上传: 上传错误]', #上传的时候发生意外
        'clipup-mwfeedbackerrorText' => '[剪贴板上传: 服务器返回错误信息(%s)]',
     
);
