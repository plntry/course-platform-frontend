import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex } from "antd";
import AuthForm from "../AuthForm";

const Login: React.FC = () => {
  return (
    <AuthForm mode="login" name="login">
      <Form.Item
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid Email!",
          },
          { required: true, message: "Please input your Email!" },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your Password!" }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Flex vertical align="center" gap={20}>
          <Button block type="primary" htmlType="submit">
            Log in
          </Button>
        </Flex>
      </Form.Item>
    </AuthForm>
  );
};

export default Login;
