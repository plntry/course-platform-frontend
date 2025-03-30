import React, { useEffect } from "react";
import { Collapse, Button, Flex } from "antd";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import AssignmentItem from "../AssignmentItem";
import AssignmentModal from "../AssignmentModal";
import Loader from "../Loader";
import { useLoaderData } from "react-router";

const AssignmentsList: React.FC<{
  courseId: number;
  sectionId: number;
  refreshKey: number;
}> = ({ courseId, sectionId, refreshKey }) => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const { assignments, loading, fetchAssignments, showAddModal } =
    useAssignmentsStore();

  useEffect(() => {
    const loadAssignments = async () => {
      // Clear previous assignments first
      useAssignmentsStore.setState({ assignments: [] });
      await fetchAssignments(String(courseId), sectionId);
    };

    loadAssignments();
  }, [sectionId, refreshKey]);

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
        <Collapse
          defaultActiveKey={[]}
          items={assignments.map((assignment) => ({
            key: assignment.id.toString(),
            label: assignment.title,
            children: <AssignmentItem assignment={assignment} />,
          }))}
          style={{ width: "100%" }}
        />
      ) : (
        <Flex justify="center" style={{ width: "100%" }}>
          There're no assignments yet
        </Flex>
      )}

      {role === UserRoles.TEACHER && <AssignmentModal sectionId={sectionId} />}
    </Flex>
  );
};

export default React.memo(AssignmentsList);
