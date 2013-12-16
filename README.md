## ClipUpload

The ClipUpload extension allows to upload files directly from your clipboard.

### Installation

1. [Download](https://github.com/SLboat/ClipUpload/archive/master.zip) the extension.
2. Extract the files in a directory called `ClipUpload` in your `extensions/` folder.
3. Add `require_once "$IP/extensions/ClipUpload/ClipUpload.php";` to your "LocalSettings.php" file.
4. Configure this extension as needed (see the [[#Configuration|configuration section]]).
5. Verify the installation on "Special:Version".

### Configuration

This extension provides three parameters available for configuration:
* $wgClipUP_Comment

   Allows to set a standard text added to the files description upon uploading a file.  
   Standard value is `This file was uploaded from the clipboard ([[Category:Clipboard upload]]).`

* $wgClipUP_MaxFileSize

   Allows to set the maximum size in KB for files uploadable by this extension.  
   Standard value is `500`

* $wgClipUP_CheckSameFileSize

   Allows to check if the size of a file is the same as for the previously uploaded file.  
   Standard value is `false`

### Links

* [Homepage](https://www.mediawiki.org/wiki/Extension:ClipUpload)
* [Support](https://www.mediawiki.org/wiki/Extension_talk:ClipUpload)
* [Issue tracker](https://github.com/SLboat/ClipUpload/issues)
* [Source code](https://github.com/SLboat/ClipUpload)
