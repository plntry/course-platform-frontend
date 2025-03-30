import React, { useEffect } from "react";
import { Collapse, Button, Flex } from "antd";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import AssignmentItem from "../AssignmentItem";
import AssignmentModal from "../AssignmentModal";
import Loader from "../Loader";

const AssignmentsList: React.FC<{ sectionId: number }> = ({ sectionId }) => {
  // const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const role = UserRoles.STUDENT;
  const { assignments, loading, fetchAssignments, showAddModal } =
    useAssignmentsStore();

  useEffect(() => {
    fetchAssignments(sectionId);
  }, [sectionId, fetchAssignments]);

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      style={{ gap: 16, height: "100%" }}
    >
      {role === UserRoles.TEACHER && (
        <Button
          type="primary"
          onClick={showAddModal}
          style={{ alignSelf: "flex-end" }}
        >
          Add Assignment
        </Button>
      )}

      {loading ? (
        <Loader />
      ) : assignments.length ? (
        <>
          <Collapse
            defaultActiveKey={[]}
            items={assignments.map((assignment) => ({
              key: assignment.id.toString(),
              label: assignment.title,
              children: <AssignmentItem assignment={assignment} />,
            }))}
            style={{ width: "100%" }}
          />
          {role === UserRoles.TEACHER && <AssignmentModal />}
        </>
      ) : (
        <Flex justify="center" style={{ width: "100%" }}>
          There're no assignments yet
        </Flex>
      )}
    </Flex>
  );
};

export default AssignmentsList;
