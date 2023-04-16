import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";

import * as S from "./styles";
import Newsletter from "../Newsletter";

import BackToTopButton from "../../components/BackToTopButton/BackToTopButton";

const UserLayout = () => {
  return (
    <S.Wrapper>
      <Header />
      <S.MainContainer>
        <S.MainContent>
          <Outlet />
        </S.MainContent>
      </S.MainContainer>
      <Newsletter />
      <Footer />
      <BackToTopButton />
    </S.Wrapper>
  );
};

export default UserLayout;
