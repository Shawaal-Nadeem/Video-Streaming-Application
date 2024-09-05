import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';  // Import HLS.js


export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);
  const {options, onReady} = props;

  React.useEffect(() => {

    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode. 
      const videoElement = document.createElement("video-js");

      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        videojs.log('player is ready');
        onReady && onReady(player);
      });


      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(options.sources[0].src); // Load the HLS source
        hls.attachMedia(videoElement); // Attach to the video element
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videojs.log('HLS manifest loaded');
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = options.sources[0].src; // Native HLS support
      } else {
        videojs.log('HLS not supported in this browser');
      }

    // You could update an existing player in the `else` block here
    // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  React.useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className=' w-[50%]'>
      <div ref={videoRef} />
    </div>
  );
}

export default VideoJS;