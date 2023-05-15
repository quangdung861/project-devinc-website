import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const SidebarContainer = styled.div`
  /* position: absolute; */
  min-width: ${(props) => (props.isShowSidebar ? "230px" : "61px")};
  max-width: ${(props) => (props.isShowSidebar ? "230px" : "61px")};
  background-color: #182537;
  transition: all 0.5s ease;
  & .header-sidebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px;
    height: 60px;
    & span {
      font-size: 24px;
      font-weight: 500;
      color: white;
      cursor: pointer;
    }
  }
`;

export const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  margin: 4px;
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #243041;
    color: white;
    & .icon {
      color: white;
    }
  }

  .icon {
    font-size: 22px;
    color: #a3a8af;
  }

  ${(props) =>
    props.active === "true" &&
    css`
      /* border-right: 5px solid #00474f; */
      background-color: #0088ff;

      .icon {
        color: white;
      }

      &:hover {
        background-color: #0088ff;
      }
    `}
`;
