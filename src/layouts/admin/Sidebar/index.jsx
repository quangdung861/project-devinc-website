import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { MenuOutlined } from "@ant-design/icons";
import { Space } from "antd";

import { SIDEBAR_ITEMS } from "./constants";
import { ROUTES } from "../../../constants/routes";
import * as S from "./styles";

function Sidebar(props) {
  const { pathname } = useLocation();
  const newPathname = pathname.split("/").slice(0, 3).join("/");
  const navigate = useNavigate();
  const { isShowSidebar, setIsShowSidebar } = props;

  const renderSidebarItems = () => {
    return SIDEBAR_ITEMS.map((item, index) => {
      return (
        <S.SidebarItem
          key={index}
          to={item.path}
          active={newPathname === item.path ? "true" : "false"}
        >
          <Space className="menu-content">
            {item.icon}
            {isShowSidebar && item.title}
          </Space>
        </S.SidebarItem>
      );
    });
  };

  return (
    <S.SidebarContainer isShowSidebar={isShowSidebar}>
      <div className="header-sidebar">
        {isShowSidebar && (
          <span onClick={() => navigate(ROUTES.ADMIN.ORDERS)}>DE VINC</span>
        )}
        <MenuOutlined
          style={{
            fontSize: 24,
            color: "white",
            cursor: "pointer",
            paddingLeft: "4px",
          }}
          onClick={() => setIsShowSidebar(!isShowSidebar)}
        />
      </div>
      <S.SidebarContent>{renderSidebarItems()}</S.SidebarContent>
    </S.SidebarContainer>
  );
}

export default Sidebar;
