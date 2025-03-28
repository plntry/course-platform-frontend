import React, { useState } from "react";
import { Button } from "antd";
import { Link } from "react-router";
import { CourseActionConfig, GetCourse } from "../../models/Course";
import DeleteModal from "../DeleteModal";
import { coursesApi } from "../../api/courses";
import { NotificationInstance } from "antd/es/notification/interface";

interface ActionButtonProps {
  action: CourseActionConfig;
  course: GetCourse;
  notification: NotificationInstance;
  showDeleteModal: boolean;
  setShowDeleteModal: (value: boolean) => void;
  mode: string | null;
  onDelete?: () => void;
}

const CourseActionRenderer: React.FC<ActionButtonProps> = ({
  action,
  course,
  notification,
  showDeleteModal,
  setShowDeleteModal,
  mode,
  onDelete,
}) => {
  const initialDisabled: boolean =
    (action?.disabledIfAlreadyEnrolled && course.is_enrolled) ||
    ((action?.disabledIfAlreadyEnrolled && mode === "my") as boolean);

  const [isDisabled, setIsDisabled] = useState<boolean>(initialDisabled);

  const dynamicLink = action.dynamicParam
    ? action.link.replace(
        action.dynamicParam.stringToReplace,
        course[action.dynamicParam.propName] + ""
      )
    : action.link;

  if (action.title === "Delete") {
    return (
      <>
        <Button
          {...action.buttonProps}
          disabled={isDisabled}
          block
          onClick={() => setShowDeleteModal(true)}
        >
          {action.title}
        </Button>
        {showDeleteModal && (
          <DeleteModal
            data={course}
            deleteRequest={async () => coursesApi.delete(course.id + "")}
            onClose={() => setShowDeleteModal(false)}
            onSuccess={onDelete}
          />
        )}
      </>
    );
  } else if (action.onClick) {
    return (
      <Button
        {...action.buttonProps}
        disabled={isDisabled}
        block
        onClick={() => {
          (async () => {
            const courseId = action.dynamicParam
              ? course[action.dynamicParam.propName] + ""
              : course.id + "";
            const isSuccess = await action.onClick!(courseId, notification);
            if (isSuccess) {
              setIsDisabled(true);
            }
          })().catch((err) => console.error(err));
        }}
      >
        {action.title}
      </Button>
    );
  } else {
    return (
      <Link to={dynamicLink}>
        <Button {...action.buttonProps} disabled={isDisabled} block>
          {action.title}
        </Button>
      </Link>
    );
  }
};

export default CourseActionRenderer;
