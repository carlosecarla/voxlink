<?php

$pasta = "audios/";

$arquivos = glob($pasta . "*.mp4");

rsort($arquivos);

$resultado = [];

foreach($arquivos as $arquivo){

    $resultado[] = [
        'arquivo' => $arquivo,
        'hora' => date(
            'd/m/Y H:i:s',
            filemtime($arquivo)
        )
    ];
}

header('Content-Type: application/json');

echo json_encode($resultado);
