import React, { useEffect, useState } from "react";
import { UpOutlined } from "@ant-design/icons";

import "./styles.css";

const BackToTopButton = () => {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    });
  }, []);

  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    backToTopButton && (
      <div className="scroll-to" onClick={scrollUp}>
        <UpOutlined />
      </div>
    )
  );
};

export default BackToTopButton;
