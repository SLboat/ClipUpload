<?php
/**
 * Initialization file for the ClipUpload extension.
 * 
 * @link https://www.mediawiki.org/wiki/Extension:ClipUpload Documentation
 * @link https://www.mediawiki.org/wiki/Extension_talk:ClipUpload Support
 * @link https://github.com/SLboat/ClipUpload/issues Issue tracker
 * @link https://github.com/SLboat/ClipUpload Source Code
 * @link http://see.sl088.com Author
 *
 * @ingroup Extensions
 *
 * @licence http://www.gnu.org/copyleft/gpl.html GNU General Public License 2.0 or later
 * @author Slboat
 */

# Setup and Hooks for the MsUpload extension
if (!defined('MEDIAWIKI')) {
    echo ("This file is an extension to the MediaWiki software and cannot be used standalone.\n");
    die(1);
}

## Register extension setup hook and credits:
$wgExtensionCredits['parserhook'][] = array(
    'name' => 'ClipUpload',
    'url' => 'https://www.mediawiki.org/wiki/Extension:ClipUpload',
    'descriptionmsg' => 'clipup-desc',
    'version' => '1.3.0',
    'author' => '[http://see.sl088.com SLboat]',
    'license-name' => 'GPL-2.0+'
);

$dir = dirname(__FILE__) . '/';
$wgExtensionMessagesFiles['ClipUpload'] = $dir . 'ClipUpload.i18n.php';

$wgHooks['EditPage::showEditForm:initial'][] = 'ClipSetup';

$wgResourceModules['ext.ClipUpload'] = array(
    // load the js module
    'scripts' => array(
        'js/paste.js',
        'js/inline-attach.js',
        'js/clipupload.js',
        'js/ink-go.js'
    ),
    // 多语言消息文本咯
    'messages' => array(
        'clipup-desc',
        'clipup-notLoadConfig', //will cause this if clipup_vars not load
        'clipup-progressText',
        'clipup-failduploadText',
        'clipup-uploadingText',
        'clipup-urlText', 
        'clipup-notsamesize',
        'clipup-istoolarge', 
        'clipup-errdoingupload',
        'clipup-mwfeedbackerrorText',

    ),
    //本地基础路径
    'localBasePath' => dirname(__FILE__),
    //远程扩展路径？
    'remoteExtPath' => 'ClipUpload'
);


function ClipSetup()
{
    
    //申请使用全局变量
    global $wgOut, $wgClipUP_Comment, $wgClipUP_MaxFileSize, $wgClipUP_CheckSameFileSize;
    
    //未定义时候的默认值
    if (is_null($wgClipUP_Comment)) {
        $wgClipUP_Comment = 'This file was uploaded from the clipboard ([[Category:Clipboard upload]]).';
    }
    //最大默认500K
    if (is_null($wgClipUP_MaxFileSize)) {
        $wgClipUP_MaxFileSize = 500;
    }
    //是否检查文件一样大小
    if (is_null($wgClipUP_CheckSameFileSize)) {
        $wgClipUP_CheckSameFileSize = false;
    }
    
    //js临时方式输出一种变量，注册message或许更好
    $clipup_vars = array(
        'comment' => $wgClipUP_Comment,
        'maxfilesize' => $wgClipUP_MaxFileSize
        
    );
    
    //php-json格式化-参考自msupload
    $clipup_vars = json_encode($clipup_vars);
    
    //输出到全局script,或许该有点别的方式来工作
    /* if this faild,will cause 'clipup-notLoadConfig' say it */
    $wgOut->addScript("<script type='text/javascript'>var clipup_vars = $clipup_vars ;</script>\n");
    
    //load module
    $wgOut->addModules('ext.ClipUpload');
    
    return true;
}
