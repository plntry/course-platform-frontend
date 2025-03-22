import React, { useState } from "react";
import { Button, Space, Typography } from "antd";
import { CourseAssignment } from "../../models/Course";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import { useAuthStore } from "../../store/useAuthStore";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import dayjs from "dayjs";
import DeleteModal from "../DeleteModal";

const AssignmentItem: React.FC<{ assignment: CourseAssignment }> = ({
  assignment,
}) => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  // const role = UserRoles.STUDENT;
  console.log({ assignment });

  const { showEditModal } = useAssignmentsStore();
  const [showDelete, setShowDelete] = useState(false);

  const today = dayjs();
  const dueDate = dayjs(assignment.due_date);
  const canViewDetails = role === UserRoles.TEACHER || today.isBefore(dueDate);

  const assignmentDetails = [
    { title: "Description", value: assignment.description },
    { title: "Due Date", value: dueDate.format("YYYY-MM-DD") },
    { title: "Teacher Comments", value: assignment.teacher_comments },
    { title: "Files", value: assignment.files },
  ];

  return (
    <>
      {canViewDetails ? (
        <>
          {assignmentDetails.map(
            (el, index) =>
              el.value && (
                <Typography.Paragraph key={index}>
                  <strong>{el.title}:</strong> {el.value}
                </Typography.Paragraph>
              )
          )}
        </>
      ) : (
        <Typography.Text type="warning">
          This assignment is no longer available for viewing.
        </Typography.Text>
      )}
      {role === UserRoles.TEACHER && (
        <Space>
          <Button type="link" onClick={() => showEditModal(assignment)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        </Space>
      )}
      {canViewDetails && role === UserRoles.STUDENT && (
        <Button type="primary" onClick={() => {}}>
          Mark As Done
        </Button>
      )}
      {role === UserRoles.TEACHER && showDelete && (
        <DeleteModal
          data={assignment}
          deleteRequest={async () => {
            return new Promise((resolve) => {
              const { deleteAssignment } = useAssignmentsStore.getState();
              deleteAssignment(assignment.id);
              // resolve({ status: 200 });
            });
          }}
          onClose={() => setShowDelete(false)}
          onSuccess={() => {}}
        />
      )}
    </>
  );
};

export default AssignmentItem;
