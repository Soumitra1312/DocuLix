import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./projectCard";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

  const projects = [
    {
      title: "Khouloud Taouchikht",
      description: "Software Engineer",
      imgUrl: "https://i.postimg.cc/qqwFdbJv/Screenshot-2023-04-23-172918.png",
    },
    {
      title: "OUSSAMA LOUATI",
      description: "Software Engineer",
      imgUrl: "https://i.postimg.cc/xCRJGMjz/OUSSAMA-LOUATI.jpg",
    },
    {
      title: "Houda el ibrahimi",
      description: "Software Engineer",
      imgUrl: "https://i.postimg.cc/zvhmZSLL/justme-1.jpg",
    },
  ];

  // Section removed as requested - "Who we are?" section has been eliminated
  return null;
}
