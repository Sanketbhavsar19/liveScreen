
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getVideoCards } from "../../utils";
import { Typography } from "@mui/material";
import Hls from 'hls.js';

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
  margin-right: 0; // Ensure no extra margin on the right
  margin-left: -10px;  /


  ${({ isHovered}) => isHovered ? `
    margin-left: -20px;
  `:
  `margin-left: -10px;`}
`;

const StyledCard = styled.div`
  background: transparent;
  padding: 0;
  font-size: 10px;
  cursor: pointer;
  // width: calc(293px - 6px); 
  // height: 100%; 
  width:293px;
  height:165px;
  position: relative;
  border: none;
  outline: none;
  flex-shrink: 0; 
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
  overflow: visible; 
  margin: 0 1px; 
  transition: transform 0.2s ease, z-index 0.2s ease;

  ${({ isHovered, index }) => isHovered && `
   transform: scale(1.1);
      z-index: 2; 
     margin: 0 15px;
     transition: transform 0.3s ease, margin 0.3s ease;

    transform: ${index === 0 ? 'translate(10px, -20px) scale(1.1)' :
    index === 1 ? 'translate(10px, -20px) scale(1.1)' :
    index === 2 ? 'translate(10px, -20px) scale(1.1)' :
    index === 3 ? 'translate(-8px, -15px) scale(1.1)' :
    index === 4 ? 'translate(-8px, -20px) scale(1.1)' : 'translateY(-5%) scale(1.1)'};
    z-index: 2; 
    margin-left: ${index === 4 || index === 3 ? '40px' : '20px'};
    margin-right: ${index === 3 ? '20px' : '40px'};
  `}

  ${({ isSiblingHovered, index, hoveredIndex }) => isSiblingHovered && `
    transform: ${index < hoveredIndex ? 
    'translateX(-20px) scale(1.5)' 
    : 'translateX(20px) scale(1.5)'};
    z-index: 1;
    transition: transform 0.3s ease, margin 0.3s ease;
    opacity: 0.8;
  `}

  ${({ isSiblingHovered }) => isSiblingHovered && `
    transform: scale(0.9); 
    z-index: 1;
    opacity: 0.8;
  `}

  &:first-child {
    margin-left: 10px; 
  }

  &:last-child {
    margin-right: 30px;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%; 
  object-fit: cover;
  transition: transform 0.3s ease;
  aspect-ratio: 16/9; // or 4/3 or any other aspect ratio
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
   loop: true; 
   preload:"auto";
   autoPlay: true; 
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
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      const videoData = await getVideoCards();
      setVideos(videoData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    videos.forEach((video, index) => {
      const videoElement = videoRefs.current[index];
      if (videoElement) {
        if (Hls.isSupported() && video.url.endsWith('.m3u8')) {
          const hls = new Hls();
          hls.loadSource(video.url);
          hls.attachMedia(videoElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(error => {
              console.error("Autoplay failed:", error);
            });
          });
        } else {
          videoElement.src = video.url;
          videoElement.play().catch(error =>{
            console.error("Autoplay failed:", error);
          })
        }
      }
    });
  }, [videos]);

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
        {videos?.slice(0, 5).map((video, index) => (
          <StyledCard
            key={index}
            index={index}
            isHovered={hoveredIndex === index}
            isSiblingHovered={hoveredIndex !== null && hoveredIndex !== index}
            onClick={() => handleVideoSelect(video)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Video 
              ref={el => videoRefs.current[index] = el} // Set video ref
              preload="metadata"
              autoPlay
              loop
              muted ={true}
              // onPlay={(e) => e.target.muted = true}
            />
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





// import React, { useState, useEffect, useRef } from "react";
// import styled from "styled-components";
// import { getVideoCards } from "../../utils";
// import { Typography } from "@mui/material";
// import Hls from 'hls.js';

// const Container = styled.div`
//   position: absolute;
//   padding: 0;
//   overflow: hidden;
//   top: 0;
//   bottom: 0;
//   width: 100%;
//   height: 100%;
// `;

// const Title = styled.span`
//   color: white;
//   display: block;
//   top: 0;
//   padding: 0;
//   text-align: left;
//   margin-bottom: 5px;
//   z-index: 1;
//   position: relative;
// `;

// const CardContainer = styled.div`
//   display: flex;
//   width: 100%;
//   padding: 0;
//   align-items: center;
//   white-space: nowrap;
//   justify-content: space-between;
//   margin-right: 0;
//   margin-left: -10px;

//   ${({ isHovered }) =>
//     isHovered
//       ? `
//     margin-left: -20px;
//   `
//       : `margin-left: -10px;`}
// `;

// const StyledCard = styled.div`
//   background: black;
//   padding: 0;
//   font-size: 10px;
//   cursor: pointer;
//   width: 293px;
//   height: 165px;
//   position: relative;
//   border: none;
//   outline: none;
//   flex-shrink: 0;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   overflow: visible;
//   margin: 0 1px;
//   transition: transform 0.2s ease, z-index 0.2s ease;
//   opacity: ${({ isSelected }) => (isSelected ? 0 : 1)};
//   transition: opacity 0.5s ease, transform 0.3s ease;

//   ${({ isHovered, index }) =>
//     isHovered &&
//     `
//     transform: scale(1.1);
//     z-index: 2;
//     margin: 0 15px;
//     transition: transform 0.3s ease, margin 0.3s ease;
//     transform: ${
//       index === 0
//         ? 'translate(10px, -20px) scale(1.1)'
//         : index === 1
//         ? 'translate(10px, -20px) scale(1.1)'
//         : index === 2
//         ? 'translate(10px, -20px) scale(1.1)'
//         : index === 3
//         ? 'translate(-8px, -15px) scale(1.1)'
//         : index === 4
//         ? 'translate(-8px, -20px) scale(1.1)'
//         : 'translateY(-5%) scale(1.1)'
//     };
//     z-index: 2;
//     margin-left: ${index === 4 || index === 3 ? '40px' : '20px'};
//     margin-right: ${index === 3 ? '20px' : '40px'};
//   `}

//   ${({ isSiblingHovered, index, hoveredIndex }) =>
//     isSiblingHovered &&
//     `
//     transform: ${index < hoveredIndex ? 'translateX(-20px) scale(1.5)' : 'translateX(20px) scale(1.5)'};
//     z-index: 1;
//     transition: transform 0.3s ease, margin 0.3s ease;
//     opacity: 0.8;
//   `}

//   ${({ isSiblingHovered }) =>
//     isSiblingHovered &&
//     `
//     transform: scale(0.9);
//     z-index: 1;
//     opacity: 0.8;
//   `}

//   &:first-child {
//     margin-left: 10px;
//   }

//   &:last-child {
//     margin-right: 30px;
//   }
// `;

// const VideoPreview = styled.video`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   transition: transform 0.3s ease;
//   aspect-ratio: 16/9;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
// `;

// const TitleWrapper = styled.div`
//   left: 0;
//   width: 90%;
//   padding: 10px;
//   align-item: left;
//   margin-left: 30px;
//   margin-right: -40px;
// `;

// export default function RailCards({ onVideoSelect }) {
//   const [videos, setVideos] = useState([]);
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const videoRefs = useRef([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const videoData = await getVideoCards();
//       setVideos(videoData);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     videos.forEach((video, index) => {
//       const videoElement = videoRefs.current[index];
//       if (videoElement) {
//         if (Hls.isSupported() && video.url.endsWith('.m3u8')) {
//           const hls = new Hls();
//           hls.loadSource(video.url);
//           hls.attachMedia(videoElement);
//           hls.on(Hls.Events.MANIFEST_PARSED, () => {
//             videoElement.play().catch(error => {
//               console.error("Autoplay failed:", error);
//             });
//           });
//         } else {
//           videoElement.src = video.url;
//           videoElement.play().catch(error => {
//             console.error("Autoplay failed:", error);
//           });
//         }
//       }
//     });
//   }, [videos]);

//   const handleVideoSelect = (video) => {
//     if (onVideoSelect) {
//       onVideoSelect(video);
//     }
//   };

//   const handleMouseEnter = (index) => {
//     setHoveredIndex(index);
//   };

//   const handleMouseLeave = () => {
//     setHoveredIndex(null);
//   };

//   return (
//     <Container>
//       <Title>New TV Channels</Title>
//       <CardContainer>
//         {videos?.slice(0, 5).map((video, index) => (
//           <StyledCard
//             key={index}
//             index={index}
//             isHovered={hoveredIndex === index}
//             isSiblingHovered={hoveredIndex !== null && hoveredIndex !== index}
//             onClick={() => handleVideoSelect(video)}
//             onMouseEnter={() => handleMouseEnter(index)}
//             onMouseLeave={handleMouseLeave}
//             isSelected={hoveredIndex === index}
//           >
//             <VideoPreview
//               ref={el => (videoRefs.current[index] = el)}
//               preload="metadata"
//               autoPlay
//               loop
//               muted
//             />
//             <TitleWrapper>
//               <Typography
//                 variant="h6"
//                 component="div"
//                 style={{
//                   color: "white",
//                   textAlign: "left",
//                   fontSize: "12px",
//                   marginLeft: "-35px",
//                   padding: 0,
//                 }}
//               >
//                 {video.title}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{
//                   color: "grey",
//                   textAlign: "left",
//                   fontSize: "12px",
//                   marginLeft: "-35px",
//                   padding: 0,
//                 }}
//               >
//                 {video.showtitle}
//               </Typography>
//             </TitleWrapper>
//           </StyledCard>
//         ))}
//       </CardContainer>
//     </Container>
//   );
// }
