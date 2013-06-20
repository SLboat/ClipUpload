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

$wgHooks['EditPage::showEditForm:initial'][] = 'MSLSetup';

$wgResourceModules['ext.MsUpload'] = array(
        // load the js module
        'scripts' => array( 'js/InlineAttachment/jquery.inline-attach.js', 'js/clipupload.js' ),

);

 
function MSLSetup() {

  global $wgOut
  
  //load module
  $wgOut->addModules( 'ext.MsUpload' );

  return true;
}
