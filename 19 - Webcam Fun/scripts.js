const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(localMediaStream => {
    console.log(localMediaStream)
    video.srcObject = localMediaStream;
    video.play();
  })
  .catch(err => console.log('uh oh!', err))
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //get pixels
    const pixels = ctx.getImageData(0, 0, width, height);
    //mess with them -- these are the filters
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // pixels = greenScreen(pixels);
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  //play the sound
  snap.currentTime = 0;
  snap.play();

  //grab the data from url
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  // link.textContent = 'Download Image';
  link.innerHTML  =`<img scr = '${data}' alt='handsome person />`
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    const [red, green, blue] = [
      pixels.data[i],
      pixels.data[i + 1],
      pixels.data[i + 2],
    ];

    red = red + 100;
    green = green - 50;
    blue = blue * 0.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    const [red, green, blue] = [
      pixels.data[i],
      pixels.data[i + 1],
      pixels.data[i + 2]
    ];

    pixels.data[i - 150] = red;
    pixels.data[i + 100] = green;
    pixels.data[i - 150] = blue;
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rbg input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (let i = 0; i < pixels.data.length; i += 4) {
    const [red, green, blue, alpha] = [
      pixels.data[i],
      pixels.data[i + 1],
      pixels.data[i + 2],
      pixels.data[i + 3]
    ];

    if (
      red >= levels.rmin &&
      green >= levels.bmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      alpha = 0;
    }
  }

}

getVideo()

video.addEventListener('canplay', paintToCanvas);
