import styled, { css } from "styled-components";

export const MainContainer = styled.div`
  background-color: #f0f1f1;
  display: flex;
`;
export const MainContent = styled.div`
  flex: 1;
  min-height: 100vh;
  /* ${(props) =>
    props.isShowSidebar &&
    css`
      margin-left: 230px;
      width: calc(100% - 230px);
    `} */
`;

export const LoadingWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
