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
 * @author Kghbln
 */
$messages['en'] = array(
	'clipup-desc' => 'Allows to upload files directly from the clipboard using InlineAttachement',
        'clipup-notLoadConfig' => '[Clip_Upload:The configuration was not loaded]',
        'clipup-progressText' => ':[Clip_Upload:Uploading file …]()',
        'clipup-failduploadText' => ':[Clip_Upload:Upload failed (%s)]',
        //please do not translate inside the flag%s. It will be replace some other text.
        'clipup-uploadingText' => ':[Clip_Upload:Uploading %s (%s KB) …]',
        'clipup-urlText' => ':[[File:%s]]',
        'clipup-notsamesize' => ':[Clip_Upload:The file is not identical]',
        'clipup-istoolarge' => ':[Clip_Upload:The file is too large: %s KB!]',
        'clipup-errdoingupload' => ':[Clip_Upload:An error occured during the upload]',
        'clipup-mwfeedbackerrorText' => '[Clip_Upload:An error occured during the upload (%s)]',
);

/** French
 * @author pano-pano
 */
$messages['fr'] = array(
        'clipup-desc' => 'Permet de téléverser des fichiers directement depuis le presse-papier en utilisant la fonctionnalité "InlineAttachement"',
        'clipup-notLoadConfig' => '[Clip_Upload:Configuration non chargée]',
        'clipup-progressText' => ':[Clip_Upload:Téléversement du fichier …]()',
        'clipup-failduploadText' => ':[Clip_Upload:Erreur du téléversement (%s)]',
        'clipup-uploadingText' => ':[Clip_Upload:Téléversement %s en cours (%s KB) …]',
        'clipup-urlText' => ':[[Fichier:%s]]',
        'clipup-notsamesize' => ':[Clip_Upload:Le fichier n\'est pas identique]',
        'clipup-istoolarge' => ':[Clip_Upload:La taille du fichier est trop importante: %s KB!]',
        'clipup-errdoingupload' => ':[Clip_Upload:Une erreur a eu lieu pendant le téléversement]',
        'clipup-mwfeedbackerrorText' => '[Clip_Upload:Une erreur a eu lieu pendant le téléversement (%s)]',
);

/** German (Deutsch)
 * @author Kghbln
 */
$messages['de'] = array(
        'clipup-desc' => 'Ermöglicht das direkte Hochladen von Dateien aus der Zwischenablage',
        'clipup-notLoadConfig' => '[Clip_Upload:Die Konfiguration wurde nicht geladen.]',
        'clipup-progressText' => ':[Clip_Upload:Lädt Datei hoch …]()',
        'clipup-failduploadText' => ':[Clip_Upload:Das Hochladen ist gescheitert (%s).]',
        'clipup-uploadingText' => ':[Clip_Upload:Lädt %s hoch (%s KB) …',
        'clipup-urlText' => ':[[Datei:%s]]',
        'clipup-notsamesize' => ':[Clip_Upload:Die Datei ist nicht identisch.]',
        'clipup-istoolarge' => ':[Clip_Upload:Die Datei ist zu groß: %s KB.]',
        'clipup-errdoingupload' => ':[Clip_Upload:Während des Hochladens ist ein Fehler aufgetreten.]',
        'clipup-mwfeedbackerrorText' => '[Clip_Upload:Während des Hochladens ist ein Fehler aufgetreten (%s).]',
);

/** Chinese Simplified 
 * 中文简体，啊哈
 * @mod 森亮号大船
 */
$messages['zh-hans'] = array(
	'clipup-desc' => '快速从剪贴板获取上传内容,基于伟大的InlineAttachment',
        'clipup-notLoadConfig' => '[剪贴板上传: 没有加载配置信息...]',
        'clipup-progressText' => ':[剪贴板上传: 上传文件中...]()', #这里基本可以忽略，会被很快覆盖掉
        'clipup-failduploadText' => ':[剪贴板上传: 上传失败(%s)]',
        'clipup-uploadingText' => ':[剪贴板上传: 正在上传 %s(%sKB)...]',
        'clipup-urlText' => ':[[文件:%s]]', #替换后的URL地址
        'clipup-notsamesize' => ':[剪贴板上传: 剪贴板内容一样]', #不一样大小提示
        'clipup-istoolarge' => ':[剪贴板上传: 剪贴板里的图片太大了-%sKB!]', #文件太大了
        'clipup-errdoingupload' => ':[剪贴板上传: 上传错误]', #上传的时候发生意外
        'clipup-mwfeedbackerrorText' => '[剪贴板上传: 服务器返回错误信息(%s)]',
);
