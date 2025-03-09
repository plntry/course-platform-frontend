import {
  Button,
  Flex,
  Form,
  Input,
  theme,
  Typography,
  Upload,
  UploadProps,
  notification as antdNotification,
  UploadFile,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { CreateCourse } from "../../models/Course";
import { useState } from "react";
import { coursesApi } from "../../api/courses";
import { handleAxiosRequest } from "../../utils/axiosUtils";

const { Dragger } = Upload;

const CourseForm: React.FC = () => {
  const { token: themeToken } = theme.useToken();
  const [notification, contextHolder] = antdNotification.useNotification();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      // console.log({ file });

      setFileList((prev) => [...prev, file]);
      return false; // Prevent automatic upload
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const onFinish = async (formData: CreateCourse) => {
    const courseData = {
      ...formData,
      files: fileList.map((file) => file.name),
    };
    // console.log("Complete form data:", courseData);

    await handleAxiosRequest(() => coursesApi.create(courseData), notification);
  };

  return (
    <Flex vertical justify="center" align="center">
      <Typography.Title
        level={2}
        style={{ color: themeToken.colorPrimaryActive }}
      >
        New Course
      </Typography.Title>
      <Form
        initialValues={{ rating: 0 }}
        onFinish={onFinish}
        style={{
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item
          name="category"
          rules={[{ required: true, message: "Please input the category!" }]}
        >
          <Input placeholder="Category" />
        </Form.Item>
        <Form.Item name="rating" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="lessons_count"
          rules={[
            { required: true, message: "Please input the amount of lessons!" },
            { pattern: /^[0-9]+$/, message: "The amount should be integer!" },
          ]}
        >
          <Input placeholder="Lessons Amount" />
        </Form.Item>
        <Form.Item
          name="lessons_duration"
          rules={[
            { required: true, message: "Please input the duration of lesson!" },
            {
              pattern: /^[0-9]*\.?[0-9]+$/,
              message: "The duration should be a number!",
            },
          ]}
        >
          <Input placeholder="Lesson Duration" />
        </Form.Item>

        <Form.Item>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Supports a single or a bulk upload
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item>
          <Flex vertical align="center" gap={20}>
            <Button block type="primary" htmlType="submit">
              Submit
            </Button>
          </Flex>
        </Form.Item>
        {contextHolder}
      </Form>
    </Flex>
  );
};

export default CourseForm;
