let recorder;
let audioChunks = [];
let stream;

async function liberarMicrofone() {

    try {

        stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        alert("Microfone permitido!");

        console.log("Microfone OK");

    } catch (erro) {

        console.log(erro);

        alert("Erro no microfone");
    }
}

document.addEventListener("click", () => {

    if (!stream) {
        liberarMicrofone();
    }

}, { once: true });

async function iniciarGravacao() {

    if (!stream) {

        alert("Microfone não permitido");

        return;
    }

    audioChunks = [];

    recorder = new MediaRecorder(stream);

    recorder.start();

    console.log("Gravando");

    recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
    };

    setTimeout(() => {
        recorder.stop();
   }, 60000);


    recorder.onstop = async () => {

        console.log("Enviando áudio");

        const audioBlob = new Blob(audioChunks, {
            type: 'audio/webm'
        });

        const formData = new FormData();

        formData.append(
            'audio',
            audioBlob,
            Date.now() + '.webm'
        );

        const resposta = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });

        const texto = await resposta.text();

        console.log(texto);

        alert("Áudio enviado!");
    };
}

if (typeof DEVICE !== "undefined" && DEVICE == 1) {

    setInterval(async () => {

        try {

            const resposta = await fetch(
                'status.txt?' + Date.now()
            );

            const comando = await resposta.text();

            console.log("Comando:", comando);

            if (comando.trim() === 'gravar') {

                iniciarGravacao();

                fetch('comando.php?cmd=parado');
            }

        } catch (e) {

            console.log(e);
        }

    }, 1000);
}

async function escutar() {

    const status =
        document.getElementById('status');

    status.innerHTML =
        '🔴 Gravando...';

    status.classList.add('gravando');

    await fetch('comando.php?cmd=gravar');

    console.log("Comando enviado");

    setTimeout(async () => {

        try {

            const resposta = await fetch(
                'ultimo_audio.php?' + Date.now()
            );

            const audio = await resposta.text();

            console.log(audio);

            if (!audio.trim()) {

                status.innerHTML =
                    '❌ Nenhum áudio';

                return;
            }

            const player =
                document.getElementById('player');

            player.src =
                audio + '?v=' + Date.now();

            player.load();

            await player.play();

            status.innerHTML =
                '✅ Áudio recebido';

            status.classList.remove('gravando');

        } catch (erro) {

            console.log(erro);

            status.innerHTML =
                '❌ Erro no áudio';
        }

    }, 8000);
}
