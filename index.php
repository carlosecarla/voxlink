<!DOCTYPE html>
<html lang="pt-br">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>VoxLink</title>

<link rel="stylesheet" href="assets/style.css">

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

<br><br>

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
