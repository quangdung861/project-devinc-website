import styled, { css } from "styled-components";
import { Row, Radio } from "antd";

export const Wrapper = styled.div`
  padding: 16px 0px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  .change-delivery-address {
    position: absolute;
    right: 0px;
    margin-right: 20px;
    color: #1890ff;
    font-weight: normal;
    cursor: pointer;
    &:hover {
      color: #40a9ff;
    }
  }

  & .row-title {
    font-size: 17px;
    font-weight: 500;
    line-height: 1.41;
    color: rgb(13, 92, 182);
    max-width: 130px;
  }

  & .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  & .row__subtitle {
    font-size: 11px;
    line-height: 1.45;
    color: rgb(120, 120, 120);
    overflow: hidden;
    margin-bottom: 5px;
  }

  .row__warning {
    color: rgb(253, 130, 10);
    font-style: italic;
    font-size: 11px;
    line-height: 1.45;
    overflow: hidden;
  }
`;
