<?php

$arquivos = glob("audios/*");

rsort($arquivos);

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Áudios</title>

<style>

body{
    background:#111;
    color:#fff;
    font-family:Arial;
    padding:20px;
}

audio{
    width:100%;
    margin-top:10px;
}

.item{
    background:#222;
    padding:15px;
    margin-bottom:15px;
    border-radius:10px;
}

a{
    color:#00ff88;
}

</style>

</head>
<body>

<h1>Lista de Áudios</h1>

<?php foreach($arquivos as $audio): ?>

<div class="item">

<p><?= basename($audio) ?></p>

<audio controls>
    <source src="<?= $audio ?>">
</audio>

<br><br>

<a href="<?= $audio ?>" download>
Baixar
</a>

</div>

<?php endforeach; ?>

</body>
</html>
