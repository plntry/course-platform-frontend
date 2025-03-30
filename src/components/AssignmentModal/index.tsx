import React, { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Modal, Form, Input, DatePicker } from "antd";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";

const AssignmentModal: React.FC = () => {
  const {
    isModalVisible,
    currentEditingAssignment,
    hideModal,
    addAssignment,
    editAssignment,
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
        ...currentEditingAssignment,
        due_date: dayjs(currentEditingAssignment.due_date),
      });
      prevAssignmentId.current = currentEditingAssignment.id;
    } else if (!currentEditingAssignment && prevAssignmentId.current !== null) {
      form.resetFields();
      prevAssignmentId.current = null;
    }
  }, [isModalVisible, currentEditingAssignment, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values.due_date);

        const assignmentData = {
          title: values.title,
          description: values.description,
          due_date: values.due_date.toISOString(),
          teacher_comments: values.teacher_comments,
          files: values.files,
        };
        if (currentEditingAssignment) {
          editAssignment({
            id: currentEditingAssignment.id,
            ...assignmentData,
          });
        } else {
          addAssignment(assignmentData);
        }
        hideModal();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
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
          <DatePicker />
        </Form.Item>
        <Form.Item label="Teacher Comments" name="teacher_comments">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Files" name="files">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignmentModal;
