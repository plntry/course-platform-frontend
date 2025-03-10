import { useEffect } from "react";
import { Modal, notification } from "antd";
import { GetCourse } from "../../models/Course";
import { AxiosResponse } from "axios";

const { confirm } = Modal;

interface DeleteModalProps {
  data: GetCourse;
  deleteRequest: () => Promise<AxiosResponse<any>>;
  onClose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  data,
  deleteRequest,
  onClose,
}) => {
  useEffect(() => {
    const modal = confirm({
      title: "Are you sure you want to delete it?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await deleteRequest();
          if (response.status === 200) {
            notification.success({
              message: "Deleted successfully",
            });
          } else {
            notification.error({
              message: "Failed to delete",
            });
          }
        } catch (error) {
          notification.error({
            message: "An error occurred while deleting",
          });
        } finally {
          onClose();
        }
      },
      onCancel: () => {
        onClose();
      },
    });

    return () => {
      modal.destroy();
    };
  }, [data, onClose]);

  return null;
};

export default DeleteModal;
