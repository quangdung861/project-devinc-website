import React from "react";

import Header from "../../../layouts/admin/Header";

import dashboardAdmin from "../../../assets/images/dashboardAdmin.png";

import * as S from "./styles";
const DashboardPageAdmin = () => {
  return (
    <S.MainContainer>
      <Header breadcrumb="Tổng quan" />
      <S.MainContent>
        <div style={{ width: "100%" }}>
          <img style={{ width: "100%" }} src={dashboardAdmin} alt="" />
        </div>
      </S.MainContent>
    </S.MainContainer>
  );
};

export default DashboardPageAdmin;
