import React from "react";
import { Flex, Spin } from "antd";

const containerStyle: React.CSSProperties = {
  marginTop: 200,
};

const Loader: React.FC = () => (
  <Flex vertical justify="center" style={containerStyle}>
    <Spin tip="Loading..." size="large">
      <div />
    </Spin>
  </Flex>
);

export default Loader;
