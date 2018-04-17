const app = function() {
  let canvas = document.getElementsByTagName("canvas")[0];
  let video = document.getElementsByTagName("video")[0];
  let c = canvas.getContext("2d");

  function init() {
      //set event listeners
    video.onloadedmetadata = () => {
      //dimensions
      canvas.width = video.offsetWidth;
      canvas.height = video.offsetHeight;
    };
    video.onplay = () => {
      streamVideoToCanvas(video);
    }; //resume streaming on play button after pause

  }

  function playVideo(video_src){
      if(!video_src){return alert('No source Specified');}
    video.src = video_src;
    video.play();
  }


  function streamVideo() {
    navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream)=>{
        video.srcObject = stream;
        video.play();
    }, err => {
      alert("error");
      console.log(error);
    });
    
  }

  function streamVideoToCanvas(videoEl) {
    c.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    //similar to using setTimeOut
    if (!video.paused)
      requestAnimationFrame(t => {
        // console.log(t);
        streamVideoToCanvas(videoEl);
      });
  }

  init();

  return { init,playVideo,streamVideo };
};
