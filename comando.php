<?php

if(isset($_GET['cmd'])){

    file_put_contents(
        'status.txt',
        $_GET['cmd']
    );

    echo "ok";
}
