import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getVideoCards } from "../utils"; // Ensure this path is correct
import RailCards from "./cards/railcards";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  height: 100vh; /* Full viewport height */
  width: 100%; /* Full viewport width */
  position: relative; /* Required for absolute positioning of RailCardsContainer */
  overflow: hidden;
  background-color:black;
`;

const VideoContainer = styled.div`
  position: relative;
  overflow: hidden;
  transition: height 0.3s ease; /* Smooth transition for height changes */
`;

const Video = styled.video`
  width: 100%;
  height: 100%; /* Fill the container */
  object-fit: cover;
`;

const RailCardsContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%; /* Adjust height as needed */
  display: flex;
  overflow-x: hidden; /* Allow horizontal scrolling */
  white-space: nowrap; /* Prevent cards from wrapping to the next line */
  background: black rgba(0, 0, 0, 0.1); /* Blurred background effect */
  backdrop-filter: blur(10px);
  padding: 20px;
  z-index: 1; /* Ensure it is on top of other content */
`;

const ToggleButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  z-index: 2; /* Ensure button is above the video */
  font-size: 20px;
  transition: opacity 0.3s ease; /* Smooth transition for button appearance */
`;


const MainWindow = () => {
  const [videos, setVideos] = useState([]); // List of video objects
  const [selectedVideo, setSelectedVideo] = useState(null); // Currently selected video
  const [showRailCards, setShowRailCards] = useState(false); // State to toggle RailCards visibility
  const [showToggleButton, setShowToggleButton] = useState(false); // State to show/hide the toggle button

  useEffect(() => {
    async function fetchData() {
      const videosData = await getVideoCards();
      if (videosData && videosData.length > 0) {
        setVideos(videosData); // Set the list of videos
        setSelectedVideo(videosData[0]); // Set the default selected video
      }
    }
    fetchData();
  }, []);

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setShowRailCards(false); // Optionally hide rail cards after selecting a video
  };

  return (
    <Container
      onMouseEnter={() => setShowToggleButton(true)}
      onMouseLeave={() => setShowToggleButton(false)}
    >
      <VideoContainer style={{ height: showRailCards ? "80%" : "100%" }}>
        {selectedVideo ? (
          <Video
            src={selectedVideo.url} // Use the URL from the selected video
            autoPlay
            muted // Ensure video is muted for autoplay
            controls={false} // Hide video controls
          />
        ) : (
          <p>Loading...</p>
        )}
      </VideoContainer>

      {showRailCards && (
        <RailCardsContainer>
          <RailCards videos={videos} onVideoSelect={selectVideo} />
        </RailCardsContainer>
      )}

      {showToggleButton && !showRailCards && (
        <ToggleButton onClick={() => setShowRailCards(true)}>
          <KeyboardDoubleArrowUpIcon />
        </ToggleButton>
      )}

      {showToggleButton && showRailCards && (
        <ToggleButton onClick={() => setShowRailCards(false)}>
          <KeyboardDoubleArrowDownIcon />
        </ToggleButton>
      )}
    </Container>
  );
};

export default MainWindow;
