const app = function(canvas, video) {
  let ctracker = new clm.tracker();
  ctracker.init();

  let c = canvas.getContext("2d");

  function init() {
    //set event listeners
    video.onloadedmetadata = () => {
      video.width = canvas.width = video.offsetWidth;
      video.height = canvas.height = video.offsetHeight;
      ctracker.init();
      ctracker.start(video);
    };
    video.onplay = () => {
      streamVideoToCanvas(video, ctracker);
    }; //resume streaming on play button after pause

    deviceSelector.onchange = (event)=>{
        toggleModal('hide')
        streamVideo(event.target.value);
    }
  }

  function playVideo(video_src) {
    if (!video_src) {
      return alert("No source Specified");
    }
    video.src = video_src;
    video.play();
  }

  function chooseDevice() {
    navigator.mediaDevices.enumerateDevices().then(
      d => {
          videoInputs = d.filter(mediaDevice => {
            console.log(mediaDevice)
            return mediaDevice.kind == "videoinput";
          });
        switch (videoInputs.length) {
          case 0:
            return alert("You seem to not have an input device");
            break;
          case 1:
            return streamVideo();
            break;
          case 2:
            toggleModal("show");
            deviceSelector.innerHTML += ` <option value="${videoInputs[0].deviceId}" >${videoInputs[0].label}</option>
            <option value="${videoInputs[1].deviceId}" >${videoInputs[1].label}</option>`
            break;
        }
      },
      e => console.log("error :", e)
    );
  }

  function streamVideo(deviceId) {
    navigator.mediaDevices.getUserMedia({ video: {deviceId:deviceId ? {exact:deviceId}:undefined} }).then(
      stream => {
        video.srcObject = stream;
        video.play();
      },
      err => {
        alert("error");
        console.log(error);
      }
    );
  }

  function toggleModal(s) {
    if (s.trim().toLowerCase() == "show") {
      document.getElementById("modal").classList.add("is-active");
    } else {
      document.getElementById("modal").classList.remove("is-active");
    }
  }

  function streamVideoToCanvas(videoEl, ctracker) {
    let positions = ctracker.getCurrentPosition();
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    ctracker.draw(canvas);
    //similar to using setTimeOut
    if (!video.paused)
      requestAnimationFrame(t => {
        console.log(t);
        streamVideoToCanvas(videoEl, ctracker);
      });
  }

  init();

  function drawFaceTracking(ctracker) {
    if (!video.paused) {
      requestAnimationFrame(drawLoop);
      let positions = ctracker.getCurrentPosition();
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctracker.draw(canvas);
    }
  }

  return { init, playVideo, streamVideo, chooseDevice };
};
