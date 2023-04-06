import React from "react";

import Header from "../../../layouts/admin/Header";

import * as S from "./styles"
const DashboardPageAdmin = () => {
  return (
    <S.MainContainer>
      <Header breadcrumb="Tổng quan" />
      <S.MainContent>
        <div style={{width: "100%"}}>

        <img style={{width: "100%"}} src="https://vtcc.vn/wp-content/uploads/2023/02/dashboard-examples-hero.png" alt="" />
        </div>
      </S.MainContent>
    </S.MainContainer>
  );
};

export default DashboardPageAdmin;
