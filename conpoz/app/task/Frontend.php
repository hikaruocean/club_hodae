<?php
namespace Conpoz\App\Task;

class Frontend
{
    public $dir;
    public function __construct ()
    {
        ini_set("memory_limit", "1024M");
        $this->dir = CONPOZ_PATH . '/frontend/';
    }

    public function buildAction ($bag)
    {
        $this->build();
    }

    public function watchAction ($bag)
    {
        $dir = $this->dir;
        $fileMtimeAry = $this->getFileStructInfo();
        while (1) {
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    $fileType = filetype($dir . $file);
                    if ($fileType != 'file') {
                        continue;
                    }
                    $fileInfo = explode('.', $file);
                    $fileExt = array_pop($fileInfo);
                    if (!in_array($fileExt, array('js', 'html'))) {
                        continue;
                    }
                    if (!$fileMtimeAry[$file] || filemtime($dir . $file) != $fileMtimeAry[$file]) {
                        $fileMtimeAry = $this->getFileStructInfo();
                        $this->build();
                        break;
                    }
                }
                closedir($dh);
            }
            sleep(1);
        }
    }

    private function getFileStructInfo ()
    {
        $dir = $this->dir;
        $fileMtimeAry = array();
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                $fileType = filetype($dir . $file);
                if ($fileType != 'file') {
                    continue;
                }
                $fileInfo = explode('.', $file);
                $fileExt = array_pop($fileInfo);
                if (!in_array($fileExt, array('js', 'html'))) {
                    continue;
                }
                $fileMtimeAry[$file] = filemtime($dir . $file);
            }
            closedir($dh);
            return $fileMtimeAry;
        }
    }


    private function build ()
    {
        echo PHP_EOL . '[' . date('Y-m-d H:i:s') . '] build code';
        $varNameAry = array();
        $dir = $this->dir;
        if ($dh = opendir($dir)) {
            while (($file = readdir($dh)) !== false) {
                $fileType = filetype($dir . $file);
                if ($fileType != 'file') {
                    continue;
                }
                $fileInfo = explode('.', $file);
                $fileExt = array_pop($fileInfo);
                if ($fileExt != 'html') {
                    continue;
                }
                $varName = mb_substr($file, 0, -5);
                $varNameAry[$varName] = preg_replace(array('/[\r\n]/', '/>\s+</','/\s{2,}/'), array('', '><', ' '), file_get_contents($dir . $file));
            }
            closedir($dh);
            $appJs = preg_replace(array('/\/\*.*\*\//'), array(''), file_get_contents($dir . 'app.js'));
            foreach ($varNameAry as $key => $val) {
                $appJs = str_replace('{{' . $key . '}}', $val, $appJs);
            }
            file_put_contents(CONPOZ_PATH . '/public/js/app.js', $appJs);
        }
    }
}
