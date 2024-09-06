
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Hls from 'hls.js';  // Import hls.js
import { getVideoCards } from "../utils"; 
import RailCards from "./cards/railcards";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: black;
`;

const VideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  transition: height 0.3s ease;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
`;

const RailCardsContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  display: flex;
  overflow-x: hidden;
  white-space: nowrap;
  // background: black rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  z-index: 1;
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.5); 
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  padding: 15px;
  cursor: pointer;
  z-index: 2;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7); 
  }
`;

const MainWindow = () => {
  const [videos, setVideos] = useState([]); 
  const [selectedVideo, setSelectedVideo] = useState(null); 
  const [showRailCards, setShowRailCards] = useState(false); 
  const [showToggleButton, setShowToggleButton] = useState(false); 
  const [timer, setTimer] = useState(null);
  const videoRef = useRef(null);  
  const railCardsRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const videosData = await getVideoCards();
      if (videosData && videosData.length > 0) {
        setVideos(videosData); 
        setSelectedVideo(videosData[0]); 
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      if (selectedVideo.isHls) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(selectedVideo.url);  
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current.play().then(() => {
              videoRef.current.muted = false;  // Autoplay unmuted
            }).catch(error => {
              console.error("Autoplay failed:", error);
            });
          });
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          videoRef.current.src = selectedVideo.url;
          videoRef.current.play().then(() => {
            videoRef.current.muted = false;  // Autoplay muted
          }).catch(error => {
            console.error("Autoplay failed:", error);
          });
        }
      } else {
        videoRef.current.src = selectedVideo.url;
        videoRef.current.play().then(() => {
          videoRef.current.muted = false;  // Autoplay muted
      }).catch(error => {
        console.error("Autoplay failed:", error);
      });      
    }
  }
  if (videoRef.current) {
    const handleEnded = () => {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    };

    videoRef.current.addEventListener('ended', handleEnded);

    return () => {
      videoRef.current.removeEventListener('ended', handleEnded);
    };
  }
  }, [selectedVideo]);

  // const handleUnmute = () => {
  //   if (videoRef.current) {
  //     videoRef.current.muted = false;
  //   }
  // };

  const selectVideo = (video) => {
    setSelectedVideo(video);
    showRailCardsWithTimer();
  }

  const showRailCardsWithTimer = () => {
    setShowRailCards(true);
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (railCardsRef.current && !railCardsRef.current.matches(':hover')) {
        setShowRailCards(false);
      }
    }, 5000);
    setTimer(newTimer);
  };

  const hideRailCards = () => {
    setShowRailCards(false);
    clearTimeout(timer);
  }

  const handleRailCardsMouseEnter = () => {
    clearTimeout(timer);
  };

  const handleRailCardsMouseLeave = () => {
    showRailCardsWithTimer();
  };

  return (
    <Container
      onMouseEnter={() => setShowToggleButton(true)}
      onMouseLeave={() => setShowToggleButton(false)}
    >
      {selectedVideo ? (
        <>
        <Video
         ref={videoRef}  
         autoPlay={true}
         loop
         controls={false}
         muted = {true}
         onPlay={(e) => e.target.muted = false}
        />
        {/* <button onClick={handleUnmute}>Unmute</button>  */}
        </>
      ) : (
        <p>Loading...</p>
      )}

      {showRailCards && (
        <RailCardsContainer
          ref={railCardsRef}
          onMouseEnter={handleRailCardsMouseEnter}
          onMouseLeave={handleRailCardsMouseLeave}
        >
          <RailCards videos={videos} onVideoSelect={selectVideo} />
        </RailCardsContainer>
      )}

      {showToggleButton && !showRailCards && (
        <ToggleButton onClick={showRailCardsWithTimer}>
          <KeyboardDoubleArrowUpIcon />
        </ToggleButton>
      )}

      {showToggleButton && showRailCards && (
        <ToggleButton onClick={hideRailCards}>
          <KeyboardDoubleArrowDownIcon />
        </ToggleButton>
      )}
    </Container>
  );
};

export default MainWindow;
