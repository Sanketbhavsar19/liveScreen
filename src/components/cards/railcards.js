
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
  padding: 0;
  text-align: left;
  margin-bottom: 5px;
  z-index: 1; 
  position: relative;
`;

const CardContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 0;
  align-items: center; 
  white-space: nowrap; 
  justify-content: space-between;

  ${({ isHovered}) => isHovered ? `
  margin-left: -40px;
  `:
  `margin-left: -10px;`}
`;

const StyledCard = styled.div`
  background: transparent;
  padding: 0;
  font-size: 10px;
  cursor: pointer;
  width: calc(293px - 2px); 
  height: 100%; 
  position: relative;
  border: none;
  outline: none;
  flex-shrink: 0; 
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
  overflow: visible; 
  margin: 0 1px; 
  transition: transform 0.2s ease ,z-index 0.2s ease;


  ${({ isHovered,index }) => isHovered && `
    // transform: scale(1.1) translateY(-8%);
    transform: ${index === 0 ? 'translate(10px, -20px) scale(1.1)':index === 1 ? 'translate(10px, -20px) scale(1.1)' :index === 2 ? 'translate(10px, -20px) scale(1.1)':index === 3 ? 'translate(-8px, -15px) scale(1.1)':index === 4 ? 'translate(-8px, -20px) scale(1.1)' : 'translateY(-8%) scale(1.1)'};
    // transform: translate(10px, -20px) scale(1.1);
    z-index: 2; 
    // margin-right:40px;
    // margin-left:20px;
     margin-left:${(index === 4 || index === 3) ? '40px':'20px'};
     margin-right:${ index ===3 ?'20px': '40px'};
  `}

  ${({ isSiblingHovered,index,hoveredIndex }) => isSiblingHovered && `
      transform: ${index < hoveredIndex ? 
      'translateX(-10px) scale(1.0)'
       : 'translateX(10px) scale(1.0)'};
      z-index: 1;
      opacity:0.8;
  `}

  ${({ isSiblingHovered }) => isSiblingHovered && `
    transform: scale(0.9); /* Sibling cards shrink uniformly */
    z-index: 1;
    opacity: 0.8;
  `}

  &:first-child {
    margin-left: 10px; /* Add margin to the left of the first card */
  }

  &:last-child {
    margin-right: 30px;
  }
`;

const Video = styled.video`
  width: 97%;
  height: 100%; 
  object-fit: cover;
  transition: transform 0.3s ease, margin 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); 
loop: true; 
  autoPlay: true; 
  muted: true; 
  playsInline: true; 
`;

const TitleWrapper = styled.div`
  left: 0;
  width: 90%;
  padding: 10px;
  align-item: left;
  margin-left: 30px;
  margin-right: -40px;
`;

export default function RailCards({ onVideoSelect }) {
  const [videos, setVideos] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <Container>
      <Title>New TV Channels</Title>
      <CardContainer>
        {videos.slice(0, 5).map((video, index) => (
          <StyledCard
            key={index}
            index={index}
            isHovered={hoveredIndex === index}
            isSiblingHovered={hoveredIndex !== null && hoveredIndex !== index}
            onClick={() => handleVideoSelect(video)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Video src={video.url} muted preload="metadata" autoPlay loop/>
            <TitleWrapper>
              <Typography
                variant="h6"
                component="div"
                style={{
                  color: "white",
                  textAlign: "left",
                  fontSize: "12px",
                  marginLeft: "-35px",
                  padding: 0,
                }}
              >
                {video.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "grey",
                  textAlign: "left",
                  fontSize: "12px",
                  marginLeft: "-35px",
                  padding: 0,
                }}
              >
                {video.showtitle}
              </Typography>
            </TitleWrapper>
          </StyledCard>
        ))}
      </CardContainer>
    </Container>
  );
}