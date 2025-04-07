import React, { useEffect, useState } from "react";
import { Collapse, Button, Flex, Space, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import AssignmentItem from "../AssignmentItem";
import AssignmentModal from "../AssignmentModal";
import Loader from "../Loader";
import dayjs from "dayjs";
import { progressApi } from "../../api/progress";
import { notification } from "antd";

interface AssignmentsListProps {
  courseId: number;
  sectionId: number;
  isActive: boolean;
  updateProgress: (newProgress: number) => void;
}

const AssignmentsList: React.FC<AssignmentsListProps> = ({
  courseId,
  sectionId,
  isActive,
  updateProgress,
}) => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const { assignments, loading, fetchAssignments, showAddModal } =
    useAssignmentsStore();
  const [completedAssignments, setCompletedAssignments] = useState<Set<number>>(
    new Set()
  );
  const [api, contextHolder] = notification.useNotification();

  const handleMarkAsDone = async (
    assignmentId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await progressApi.markAsDone(assignmentId.toString());
      setCompletedAssignments((prev) => new Set(prev).add(assignmentId));

      // Calculate and update progress
      const newCompletedCount = completedAssignments.size + 1;
      const newProgress = +(
        (newCompletedCount / assignments.length) *
        100
      ).toFixed(2);
      console.log(newCompletedCount, assignments.length, newProgress);

      updateProgress(newProgress);

      api.success({
        message: "Success",
        description: "Assignment marked as completed",
        placement: "topRight",
      });
    } catch (error) {
      api.error({
        message: "Error",
        description: "Failed to mark assignment as completed",
        placement: "topRight",
      });
    }
  };

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        if (!isActive) return;

        useAssignmentsStore.setState({ assignments: [], loading: true });
        await fetchAssignments(courseId.toString(), +sectionId);
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
      {contextHolder}
      {role === UserRoles.TEACHER && (
        <Button
          type="primary"
          onClick={() => showAddModal(sectionId)}
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
          items={assignments.map((assignment) => {
            const today = dayjs();
            const dueDate = dayjs(assignment.due_date);
            const canViewDetails =
              role === UserRoles.TEACHER || today.isBefore(dueDate);
            const isCompleted = completedAssignments.has(assignment.id);

            return {
              key: assignment.id.toString(),
              label: assignment.title,
              extra: (
                <Space>
                  {role === UserRoles.STUDENT && (
                    <>
                      {canViewDetails ? (
                        <>
                          {isCompleted ? (
                            <Tooltip title="This assignment is completed">
                              <CheckCircleOutlined
                                style={{ color: "#52c41a" }}
                              />
                            </Tooltip>
                          ) : (
                            <Button
                              type="primary"
                              size="small"
                              onClick={(e) =>
                                handleMarkAsDone(assignment.id, e)
                              }
                            >
                              Mark as Done
                            </Button>
                          )}
                        </>
                      ) : (
                        <Tooltip title="No preview">
                          <EyeInvisibleOutlined style={{ color: "#ff4d4f" }} />
                        </Tooltip>
                      )}
                    </>
                  )}
                </Space>
              ),
              children: <AssignmentItem assignment={assignment} />,
            };
          })}
          style={{ width: "100%" }}
        />
      ) : (
        <Flex justify="center" style={{ width: "100%" }}>
          There're no assignments yet
        </Flex>
      )}
      {role === UserRoles.TEACHER && <AssignmentModal />}
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
