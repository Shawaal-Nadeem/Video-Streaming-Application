'use client'
import VideoJS from "./videoPlayer";
import { useRef } from "react";
import videojs from "video.js";

export default function Code(){
    const playerRef = useRef(null);
    const videoLink = "http://localhost:8000/uploads/courses/92bbf5d6-2357-4d6c-8a15-0be229390af2/index.m3u8"
    const videoPlayerOptions = {
        responsive: true,
        fluid: true,
        controls: true,
        sources: [
            {
                src: videoLink,
                type: "application/x-mpegURL"
            }
        ]
    }
    const handlePlayerReady = (player:any) => {
        playerRef.current = player;
    
        // You can handle player events here, for example:
        player.on("waiting", () => {
          videojs.log("player is waiting");
        });
    
        player.on("dispose", () => {
          videojs.log("player will dispose");
        });
      };
    
    return(
        <div>
            <h1 className=" font-extrabold text-4xl">Video Player</h1>
            <VideoJS options={videoPlayerOptions} onReady={handlePlayerReady}/>
        </div>
    )
}