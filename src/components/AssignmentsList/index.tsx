import React, { useEffect } from "react";
import { Collapse, Button, Flex } from "antd";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import AssignmentItem from "../AssignmentItem";
import AssignmentModal from "../AssignmentModal";
import Loader from "../Loader";

interface AssignmentsListProps {
  courseId: number;
  sectionId: number;
  isActive: boolean;
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({
  courseId,
  sectionId,
  isActive,
}) => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const { assignments, loading, fetchAssignments, showAddModal } =
    useAssignmentsStore();

  // Move debug logging to component level
  const componentKey = `section-${sectionId}`;

  // Log assignments whenever they change
  // useEffect(() => {
  //   console.log("Current assignments:", assignments);
  // }, [assignments]);

  // Fetch assignments when section becomes active
  useEffect(() => {
    const loadAssignments = async () => {
      try {
        // Only fetch if the tab is active
        if (!isActive) return;

        const validCourseId = Number(courseId);
        const validSectionId = Number(sectionId);

        if (isNaN(validCourseId) || isNaN(validSectionId)) {
          console.error("Invalid courseId or sectionId:", {
            courseId,
            sectionId,
          });
          return;
        }

        console.debug("Loading assignments for section:", {
          sectionId: validSectionId,
          isActive,
        });

        // Clear previous assignments first
        useAssignmentsStore.setState({ assignments: [], loading: true });

        // Convert to string only when making the API call
        await fetchAssignments(validCourseId.toString(), validSectionId);
      } catch (error) {
        console.error("Error loading assignments:", error);
      }
    };

    loadAssignments();
  }, [sectionId, courseId, fetchAssignments, isActive]);

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

export default React.memo(AssignmentsList, (prevProps, nextProps) => {
  return (
    prevProps.sectionId === nextProps.sectionId &&
    prevProps.courseId === nextProps.courseId &&
    prevProps.isActive === nextProps.isActive
  );
});
