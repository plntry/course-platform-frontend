import React, { useEffect, useState } from "react";
import { Collapse, Button, Flex, Space } from "antd";
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
  const {
    assignments,
    loading,
    fetchAssignments,
    showAddModal,
    increasePercentDone,
    currentSectionId,
  } = useAssignmentsStore();

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

            return {
              key: assignment.id.toString(),
              label: assignment.title,
              extra: (
                <Space>
                  {role === UserRoles.STUDENT && (
                    <>
                      {!canViewDetails ? (
                        <EyeInvisibleOutlined style={{ color: "#ff4d4f" }} />
                      ) : false ? (
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                      ) : (
                        <ClockCircleOutlined style={{ color: "#faad14" }} />
                      )}
                      {canViewDetails && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            increasePercentDone();
                          }}
                        >
                          Mark As Done
                        </Button>
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
