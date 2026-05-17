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

    recorder.ondataavailable = (e) => {

        if (e.data.size > 0) {
            audioChunks.push(e.data);
        }
    };

    recorder.onstop = async () => {

        console.log("Enviando áudio");

        const audioBlob = new Blob(audioChunks, {
            type: 'audio/mp4'
        });

        const formData = new FormData();

        formData.append(
            'audio',
            audioBlob,
            Date.now() + '.mp4'
        );

        try {

            const resposta = await fetch(
                'upload.php',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const texto = await resposta.text();

            console.log(texto);

            alert("Áudio enviado!");

        } catch (erro) {

            console.log(erro);

            alert("Erro upload");
        }
    };

    recorder.start(1000);

    console.log("Gravando 1 minuto");

    setTimeout(() => {

        if (
            recorder &&
            recorder.state !== "inactive"
        ) {

            recorder.stop();

            console.log("Gravação finalizada");
        }

    }, 60000);
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

    }, 65000);
}
