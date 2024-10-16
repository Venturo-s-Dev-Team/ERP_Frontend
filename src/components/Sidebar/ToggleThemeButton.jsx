import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";
import { Button } from "antd";

const ToggleThemeButton = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="SideBar-ToggleTheme">
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}{" "}
      </Button>
    </div>
  );
};

export default ToggleThemeButton;
