<?php
############################################################
#Author:
#Slboat,http://see.sl088.com
#
############################################################
# Setup and Hooks for the MsUpload extension
if( !defined( 'MEDIAWIKI' ) ) {
 	echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
 	die( 1 );
}

## Register extension setup hook and credits:
$wgExtensionCredits['parserhook'][] = array(
	'name' => 'ClipUpload',
	'url'  => 'http://see.sl088.com/id/49t',
	'description' => 'Quick Uplaod use clipboard,base on InlineAttachment',
	'version' => '1.0',
	'author' => '[http://see.sl088.ccom SLboat]',
);

$dir = dirname(__FILE__).'/';
//$wgAvailableRights[] = 'msupload';

$wgHooks['EditPage::showEditForm:initial'][] = 'ClipSetup';

$wgResourceModules['ext.ClipUpload'] = array(
        // load the js module
        'scripts' => array( 'js/InlineAttachment/inline-attach.js', 'js/clipupload.js' ),
        //本地基础路径
        'localBasePath' => dirname( __FILE__ ),
        //远程扩展路径？
        'remoteExtPath' => 'ClipUpload'
);

 
function ClipSetup() {

  //申请使用全局变量
  global $wgOut, $wgClipUP_Comment;

  //未定义时候的默认值
  if(is_null($wgClipUP_Comment)){$wgClipUP_Comment = 'clipboard upload';}

  //js临时方式输出一种变量，注册message或许更好
  $clipup_vars = array(
    'comment' => $wgClipUP_Comment
  );
  
  //php-json格式化-参考自msupload
  $clipup_vars = json_encode($clipup_vars);

  //输出到全局script
  $wgOut->addScript( "<script type=\"{$wgJsMimeType}\">var clipup_vars = $clipup_vars;</script>\n" );

  //load module
  $wgOut->addModules( 'ext.ClipUpload' );

  return true;
}
