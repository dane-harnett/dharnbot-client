import styled from "styled-components";

const SideBar = styled.div`
  background-color: #212121;
  border-left: 3px solid #e91530;
  box-sizing: border-box;
  color: #fff;
  display: flex;
  font-size: 24px;
  justify-content: space-between;
  padding: 6px;
  height: calc(100vh - 460px);
  width: 400px;
  right: 0;
  position: absolute;
`;

export default SideBar;
