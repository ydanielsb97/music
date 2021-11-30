const audio = new Audio();
// const audioFile = new AudioBuffer({numberOfChannels: 2, sampleRate: 48000, length: 1000000})
// console.log({audioFile})

audio.src = "losientobb.mp3";
audio.controls = true;
audio.loop = false;
audio.autoplay = false;
document.getElementById("audio_box").appendChild(audio)

const bars = 500;
const counter = 0;
const counterColor = 255;
const sum = true;
let canvas, ctx, source, context, analyser, fbc_array, bar_x, bar_width, bar_height, frequency;
let interval = null;
let timeout = null;
let setted = false

const frameLooper = () => {

    let _counter = counter;
    let _counterColor = counterColor;
    let _sum = sum

    interval = setInterval(() => {

        fbc_array = new Uint8Array(context.createAnalyser().frequencyBinCount)
        analyser.getByteFrequencyData(fbc_array)

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = `rgba(${_counterColor}, ${Math.abs(_counterColor / 2)}, ${Math.abs(_counterColor / 4)}, 1)`
        _counter++

        if (_counter % 5 === 0) {

            if(_sum && (_counterColor / 4) >= 255){
                _sum = false;
                _counterColor--;
            }else if(!_sum && (_counterColor / 4) >= 50){
                _counterColor--;
            }else{
                _counterColor++
                _sum = true;
            }
        }

        for (let i = 0; i < bars; i++) {
            bar_height = -(fbc_array[i] / 4)
            if (bar_height > -10) bar_height = 1
            bar_x = i * 1;
            bar_width = 1;

            ctx.fillRect(bar_x, canvas.height / 2, bar_width, bar_height)
            ctx.fillRect(bar_x, canvas.height / 2, bar_width, -bar_height)
        }
    }, 0)
}

const initMp3Player = async () => {
    
    context = new AudioContext();
    analyser = context.createAnalyser();

    canvas = document.getElementById("canvas")

    ctx = canvas.getContext("2d");


    source = context.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(context.destination);
    await getFile()
    setted = true
}

const callbackPlay = () => {
    !setted && initMp3Player()
    const duration = audio.duration * 1000;

    console.log({ duration })
    frameLooper()
    timeout = setTimeout(() => {

        clearInterval(interval)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }, duration)
}

const getFile = async () => {

    return await fetch("http://localhost:4000", (res) => res.json()).then(async (_data) => {
        const blob = await _data.blob();
        const arr = await blob.arrayBuffer();
        const audioBuffer = await context.decodeAudioData(arr);

        console.log({arr, audioBuffer})
        return _data
    })
}

async function drawToCanvas(audioArray) {
    const audioBuffer = await ac.decodeAudioData(audioArray);
    const float32Array = audioBuffer.getChannelData(0);
  
    const array = [];
  
    let i = 0;
    const length = float32Array.length;
    while (i < length) {
      array.push(
        float32Array.slice(i, i += chunkSize).reduce(function (total, value) {
          return Math.max(total, Math.abs(value));
        })
      );
    }
  
    canvas.width = Math.ceil(float32Array.length / chunkSize + margin * 2);
  
    for (let index in array) {
      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(margin + Number(index), centerHeight - array[index] * scaleFactor);
      ctx.lineTo(margin + Number(index), centerHeight + array[index] * scaleFactor);
      ctx.stroke();
    }
  }
  

audio.addEventListener("play", callbackPlay)

audio.addEventListener("pause", () => {

    clearInterval(interval)
    clearTimeout(timeout)
})