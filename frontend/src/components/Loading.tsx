import { FC } from "react";
import styled from "@emotion/styled";
import { Spinner } from "@bitbloq/ui";

export interface LoadingProps {
  color: string;
}
const Loading: FC<LoadingProps> = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${props => props.color};
`;

export default Loading;
