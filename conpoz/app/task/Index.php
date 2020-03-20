<?php
namespace Conpoz\App\Task;

class Index
{
    public function indexAction ($bag)
    {
        $type = 2;
        echo $type == 1 ? "1" : $type == 2 ? "2"  : $type == 3 ? "3" : "4";
    }
}
