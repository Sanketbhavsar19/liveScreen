import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getVideoCards } from "../../utils";
import { Typography } from "@mui/material";

const Container = styled.div`
  position: absolute;
  padding: 0;
  overflow: hidden;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%; 
`;

const Title = styled.span`
  color: white;
  display: block;
  top: 0;
  padding:0;
  text-align: left;
  margin-bottom: 5px; /* Space below the title */
`;

const div = styled.div`
  margin-right:10px;
  height:100%;
`;

const CardContainer = styled.div`
  flex: 1 0 20%;
  display: flex;
  width: 100%;
  overflow-x: hidden; /* Allow horizontal scrolling */
  padding: 0;
  // margin-right: 8px;
  align-items: center; /* Center items vertically */
  white-space: nowrap; /* Prevent wrapping */
`;

const StyledCard = styled.div`
  background: transparent;
  // margin-right: 10px; /* Remove space between cards */
  padding: 0; /* Remove padding */
  font-size: 10px;
  cursor: pointer;
  width: 20vw; /* Width as a percentage of viewport width */
  height: 100%; /* Fill the container height */
  position: relative;
  border: none;
  outline: none;
  flex-shrink: 0; /* Prevent cards from shrinking */
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: flex-start; /* Align items to the start of the card */
  
  &:last-child {
    margin-right: 0;
  }

  &:hover ${Video} {
    transform: scale(1.3) translateY(-10%);
    transform-origin: center center; /* Scale from the center */
  }
`;

const Video = styled.video`
  width: 80%;
  height: 70%; /* Adjust to fit within card */
  object-fit: cover;
  transition: transform 0.3s ease;
  

  &:hover {
    transform: scale(1.30) translateY(-10%);
    transform-origin: center center; 
  }
`;

const TitleWrapper = styled.div`
  bottom: 0; /* Align it to the bottom of the card */
  left: 0;
  width: 80%;
  padding: 10px;
`;

export default function RailCards({ onVideoSelect }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const videoData = await getVideoCards();
      setVideos(videoData);
    };
    fetchData();
  }, []);

  const handleVideoSelect = (video) => {
    if (onVideoSelect) {
      onVideoSelect(video);
    }
  };

  const handleMouseEnter = (e) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  };

  const handleMouseLeave = (e) => {
    const video = e.currentTarget.querySelector("video");
    if (video) {
      video.pause();
    }
  };

  return (
    <Container>
      <Title>New TV Channels</Title>
      <div>
      <CardContainer>
        {videos.slice(0, 5).map((video, index) => (
          <StyledCard
            key={index}
            onClick={() => handleVideoSelect(video)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Video src={video.url} muted preload="metadata" />
            <TitleWrapper>
              <Typography
                variant="h6"
                component="div"
                style={{
                  color: "white",
                  textAlign: "left", 
                  fontSize:"12px"                 
                }}
              >
                {video.title}
              </Typography>
              <Typography variant="body2" sx={{color:"grey", textAlign:"left",fontSize:"12px"}}>
                {video.showtitle}
              </Typography>
            </TitleWrapper>
          </StyledCard>
        ))}
      </CardContainer>
      </div>
    </Container>
  );
}
