import React from "react";
import { Button, Form, Input } from "antd";
import AuthForm from "../AuthForm";
import { formItemsLayouts } from "./formItemsLayouts";
import { UserRoles } from "../../models/User";

const Register: React.FC<{ userRoleToCreate?: UserRoles }> = ({
  userRoleToCreate = "student",
}) => {
  return (
    <AuthForm
      mode="register"
      name="register"
      userRoleToCreate={userRoleToCreate}
      scrollToFirstError
      {...formItemsLayouts.formItem}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: "Please input your username!",
            whitespace: true,
          },
          {
            min: 3,
            message: "Username should have at least 3 characters!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            type: "email",
            message: "The input is not valid Email!",
          },
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="first_name" label="First Name">
        <Input />
      </Form.Item>

      <Form.Item name="last_name" label="Last Name">
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        validateFirst
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          {
            min: 8,
            message: "Password must have at least 8 characters!",
          },
          {
            pattern: /[A-Z]/,
            message: "Password must include an uppercase letter",
          },
          {
            pattern: /\d/,
            message: "Password must have at least 1 digit!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        {...(userRoleToCreate === "student"
          ? formItemsLayouts.registerButton
          : {})}
      >
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </AuthForm>
  );
};

export default Register;
