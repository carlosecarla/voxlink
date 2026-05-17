<!DOCTYPE html>
<html lang="pt-br">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>VoxLink</title>

<link rel="stylesheet" href="assets/style.css">

<style>

.status{

    margin-top:20px;
    font-size:20px;
    font-weight:bold;
}

.gravando{

    color:red;
    animation:pulse 1s infinite;
}

@keyframes pulse{

    0%{
        opacity:1;
    }

    50%{
        opacity:0.3;
    }

    100%{
        opacity:1;
    }
}

</style>

</head>
<body>

<?php
$device = $_GET['device'] ?? '1';
?>

<div class="container">

<h1>VoxLink</h1>

<h2>
Dispositivo <?= $device ?>
</h2>

<?php if($device == 2): ?>

<button onclick="escutar()">
🎤 ESCUTA
</button>

<br><br>

<a href="audios.php">

<button>
📁 ÁUDIOS
</button>

</a>

<div
id="status"
class="status">
</div>

<br>

<audio
id="player"
controls
autoplay>
</audio>

<?php else: ?>

<p class="aguardando">
Aguardando comandos...
</p>

<?php endif; ?>

</div>

<script>

const DEVICE = <?= $device ?>;

</script>

<script src="assets/app.js"></script>

</body>
</html>
