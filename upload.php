<?php

$pasta = __DIR__ . "/audios/";

if(!is_dir($pasta)){
    mkdir($pasta, 0777, true);
}

if(!isset($_FILES['audio'])){
    die("sem audio");
}

$nome = time() . ".mp4";

$caminho = $pasta . $nome;

if(move_uploaded_file(
    $_FILES['audio']['tmp_name'],
    $caminho
)){

    file_put_contents(
        "ultimo.txt",
        "audios/" . $nome
    );

    echo "ok";

}else{

    echo "erro upload";
}
?>
