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

    console.log("==========");

    console.log("INICIANDO GRAVAÇÃO");

    console.log("Hora:",
        new Date().toLocaleTimeString()
    );

    audioChunks = [];

    recorder = new MediaRecorder(stream);

    recorder.onstart = () => {

        console.log("Recorder START");
    };

    recorder.ondataavailable = (e) => {

        console.log(
            "Chunk recebido:",
            e.data.size,
            "bytes"
        );

        if (e.data.size > 0) {

            audioChunks.push(e.data);

            console.log(
                "Total chunks:",
                audioChunks.length
            );
        }
    };

    recorder.onerror = (e) => {

        console.log(
            "ERRO recorder:",
            e
        );
    };

    recorder.onstop = async () => {

        console.log("Recorder STOP");

        console.log(
            "Total chunks finais:",
            audioChunks.length
        );

        const audioBlob = new Blob(
            audioChunks,
            {
                type: 'audio/webm'
            }
        );

        console.log(
            "Tamanho final áudio:",
            audioBlob.size,
            "bytes"
        );

        console.log(
            "Tempo final:",
            new Date().toLocaleTimeString()
        );

        const formData = new FormData();

        formData.append(
            'audio',
            audioBlob,
            Date.now() + '.webm'
        );

        try {

            console.log("Enviando upload...");

            const resposta = await fetch(
                'upload.php',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const texto =
                await resposta.text();

            console.log(
                "Resposta upload:",
                texto
            );

            alert("Áudio enviado!");

        } catch (erro) {

            console.log(
                "ERRO upload:",
                erro
            );

            alert("Erro upload");
        }
    };

    recorder.start(1000);

    console.log(
        "Recorder iniciado com chunks 1s"
    );

    let segundos = 0;

    const contador = setInterval(() => {

        segundos++;

        console.log(
            "Gravando:",
            segundos,
            "segundos"
        );

    }, 1000);

    setTimeout(() => {

        clearInterval(contador);

        console.log(
            "Tentando parar recorder..."
        );

        if (
            recorder &&
            recorder.state !== "inactive"
        ) {

            recorder.stop();

            console.log(
                "Recorder parado manualmente"
            );
        }

    }, 15000);
}

async function escutar() {

    const status =
        document.getElementById(
            'status'
        );

    status.innerHTML =
        '🔴 Gravando...';

    status.classList.add(
        'gravando'
    );

    await fetch(
        'comando.php?cmd=gravar'
    );

    console.log("Comando enviado");

    setTimeout(async () => {

        try {

            const resposta = await fetch(
                'ultimo_audio.php?' +
                Date.now()
            );

            const audio =
                await resposta.text();

            console.log(audio);

            if (!audio.trim()) {

                status.innerHTML =
                    '❌ Nenhum áudio';

                return;
            }

            const player =
                document.getElementById(
                    'player'
                );

            player.src =
                audio +
                '?v=' +
                Date.now();

            player.load();

            await player.play();

            status.innerHTML =
                '✅ Áudio recebido';

            status.classList.remove(
                'gravando'
            );

        } catch (erro) {

            console.log(erro);

            status.innerHTML =
                '❌ Erro no áudio';
        }

    }, 65000);
}
