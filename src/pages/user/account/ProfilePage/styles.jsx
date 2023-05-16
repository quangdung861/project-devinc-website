import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 30px 0px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  min-height: 80vh;

  & .content-right {
    border-left: 1px solid #ccc;
    .custom-file-label {
      display: inline-block;
      padding: 6px 12px;
      cursor: pointer;
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: 4px;
    }

    .custom-file-input {
      display: none;
    }
  }

  & .btn-submit {
    height: 40px;
    width: 80px;
  }

  @media only screen and (max-width: 576px) {
    & .content-right {
      border-left: none;
    }
    & .sidebar {
      margin-top: 50px;
    }
  }
`;
