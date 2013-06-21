<?php
############################################################
#Author:
#Slboat,http://see.sl088.com
#
############################################################
# Setup and Hooks for the MsUpload extension
if (!defined('MEDIAWIKI')) {
    echo ("This file is an extension to the MediaWiki software and cannot be used standalone.\n");
    die(1);
}

## Register extension setup hook and credits:
$wgExtensionCredits['parserhook'][] = array(
    'name' => 'ClipUpload',
    'url' => 'http://see.sl088.com/id/49t',
    'clipup-desc' => 'clipup-desc',
    'version' => '1.1',
    'author' => '[http://see.sl088.ccom SLboat]'
);

$dir = dirname(__FILE__) . '/';
$wgExtensionMessagesFiles['clipup'] = $dir . 'msupload.i18n.php';

$wgHooks['EditPage::showEditForm:initial'][] = 'ClipSetup';

$wgResourceModules['ext.ClipUpload'] = array(
    // load the js module
    'scripts' => array(
        'js/inline-attach.js',
        'js/clipupload.js',
        'js/ink-go.js'
    ),
    // 多语言消息文本咯
    'messages' => array(
        'clipup-desc',
        'clipup-progressText',
        'clipup-failduploadText',
        'clipup-uploadingText'
    ),
    //本地基础路径
    'localBasePath' => dirname(__FILE__),
    //远程扩展路径？
    'remoteExtPath' => 'ClipUpload'
);


<<<<<<< HEAD
  //申请使用全局变量
  global $wgOut, $wgClipUP_Comment, $wgClipUP_MaxFileSize, $wgClipUP_CheckSameFileSize;

  //未定义时候的默认值
  if(is_null($wgClipUP_Comment)){$wgClipUP_Comment = 'this file is upload by clipboard [[category:clipboard upload]]';}
  //最大默认500K
  if(is_null($wgClipUP_MaxFileSize)){$wgClipUP_MaxFileSize = 500;}
  //是否检查文件一样大小
  if(is_null($wgClipUP_CheckSameFileSize)){$wgClipUP_CheckSameFileSize = flase;}

  //js临时方式输出一种变量，注册message或许更好
  $clipup_vars = array(
    'comment' => $wgClipUP_Comment,
    'maxfilesize' => $wgClipUP_MaxFileSize

  );

  //php-json格式化-参考自msupload
  $clipup_vars = json_encode($clipup_vars);

  //输出到全局script
  $wgOut->addScript( "<script type=\"{$wgJsMimeType}\">var clipup_vars = $clipup_vars;</script>\n" );

  //load module
  $wgOut->addModules( 'ext.ClipUpload' );

  return true;
=======
function ClipSetup()
{
    
    //申请使用全局变量
    global $wgOut, $wgClipUP_Comment, $wgClipUP_MaxFileSize, $wgClipUP_CheckSameFileSize;
    
    //未定义时候的默认值
    if (is_null($wgClipUP_Comment)) {
        $wgClipUP_Comment = 'this file is by clipboard upload\n[[category:clipboard upload]]';
    }
    //最大默认500K
    if (is_null($wgClipUP_MaxFileSize)) {
        $wgClipUP_MaxFileSize = 500;
    }
    //是否检查文件一样大小
    if (is_null($wgClipUP_CheckSameFileSize)) {
        $wgClipUP_CheckSameFileSize = flase;
    }
    
    //js临时方式输出一种变量，注册message或许更好
    $clipup_vars = array(
        'comment' => $wgClipUP_Comment,
        'maxfilesize' => $wgClipUP_MaxFileSize
        
    );
    
    //php-json格式化-参考自msupload
    $clipup_vars = json_encode($clipup_vars);
    
    //输出到全局script
    $wgOut->addScript("<script type=\"{$wgJsMimeType}\">var clipup_vars = $clipup_vars;</script>\n");
    
    //load module
    $wgOut->addModules('ext.ClipUpload');
    
    return true;
>>>>>>> 07817e6eae43b7524b882d80972f609bbe7177a9
}
