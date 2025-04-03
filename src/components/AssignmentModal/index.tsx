import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Modal, Form, Input, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { useLoaderData } from "react-router";

const AssignmentModal: React.FC = () => {
  const { courseId } = useLoaderData();
  const {
    isModalVisible,
    currentEditingAssignment,
    hideModal,
    addAssignment,
    editAssignment,
    currentSectionId,
  } = useAssignmentsStore();
  const [form] = Form.useForm();
  const prevAssignmentId = useRef<number | null>(null);

  useEffect(() => {
    if (!isModalVisible) return;

    if (
      currentEditingAssignment &&
      currentEditingAssignment.id !== prevAssignmentId.current
    ) {
      form.setFieldsValue({
        title: currentEditingAssignment.title,
        description: currentEditingAssignment.description,
        due_date: dayjs(currentEditingAssignment.due_date),
        teacher_comments: currentEditingAssignment.teacher_comments,
      });
      prevAssignmentId.current = currentEditingAssignment.id;
    } else if (!currentEditingAssignment && prevAssignmentId.current !== null) {
      form.resetFields();
      prevAssignmentId.current = null;
    }
  }, [isModalVisible, currentEditingAssignment, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("due_date", values.due_date.toISOString());
      formData.append("teacher_comments", values.teacher_comments || "");
      formData.append(
        "section_id",
        String(currentSectionId || currentEditingAssignment?.section_id)
      );
      formData.append("order", "0");

      // Handle file upload
      const fileList = values.file as UploadFile[];
      if (fileList?.[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      if (currentEditingAssignment) {
        await editAssignment(courseId, currentEditingAssignment.id, formData);
      } else {
        await addAssignment(courseId, formData);
      }

      hideModal();
      form.resetFields();
    } catch (error) {
      console.error("Error saving assignment:", error);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title={currentEditingAssignment ? "Edit Assignment" : "Add Assignment"}
      open={isModalVisible}
      onOk={handleOk}
      onCancel={hideModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: "Please select the due date" }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="Teacher Comments" name="teacher_comments">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="File"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            maxCount={1}
            beforeUpload={() => false} // Prevent auto upload
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignmentModal;
