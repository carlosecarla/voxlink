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

    let options = {};

    if (MediaRecorder.isTypeSupported('audio/webm')) {

        options = {
            mimeType: 'audio/webm'
        };
    }

    recorder = new MediaRecorder(
        stream,
        options
    );

    recorder.ondataavailable = (e) => {

        if (e.data.size > 0) {

            audioChunks.push(e.data);

            console.log(
                "Chunk:",
                e.data.size
            );
        }
    };

    recorder.onstart = () => {

        console.log("Gravação iniciada");
    };

    recorder.onerror = (e) => {

        console.log(
            "Erro recorder:",
            e
        );
    };

    recorder.onstop = async () => {

        console.log("Finalizando áudio");

        const audioBlob = new Blob(
            audioChunks,
            {
                type: 'audio/webm'
            }
        );

        console.log(
            "Tamanho final:",
            audioBlob.size
        );

        const formData = new FormData();

        formData.append(
            'audio',
            audioBlob,
            Date.now() + '.webm'
        );

        try {

            const resposta = await fetch(
                'upload.php',
                {
                    method: 'POST',
                    body: formData
                }
            );

            const texto =
                await resposta.text();

            console.log(texto);

            alert("Áudio enviado!");

        } catch (erro) {

            console.log(erro);

            alert("Erro upload");
        }
    };

    recorder.start(1000);

    console.log("Gravando por 1 minuto");

    setTimeout(() => {

        if (
            recorder &&
            recorder.state !== "inactive"
        ) {

            recorder.stop();

            console.log(
                "Gravação encerrada"
            );
        }

    }, 60000);
}

if (
    typeof DEVICE !== "undefined" &&
    DEVICE == 1
) {

    setInterval(async () => {

        try {

            const resposta = await fetch(
                'status.txt?' +
                Date.now()
            );

            const comando =
                await resposta.text();

            console.log(
                "Comando:",
                comando
            );

            if (
                comando.trim() ===
                'gravar'
            ) {

                iniciarGravacao();

                fetch(
                    'comando.php?cmd=parado'
                );
            }

        } catch (e) {

            console.log(e);
        }

    }, 1000);
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
