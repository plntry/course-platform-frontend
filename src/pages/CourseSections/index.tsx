import React, { useMemo, useState } from "react";
import {
  Button,
  Flex,
  Grid,
  Input,
  Modal,
  Progress,
  Tabs,
  TabsProps,
  notification as antdNotification,
} from "antd";
import { Params, useLoaderData } from "react-router";
import { CourseSection, CreateCourseSection } from "../../models/Course";
import AssignmentsList from "../../components/AssignmentsList";
import classes from "./CourseSections.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import TitleComp from "../../components/Title";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";
import { courseSectionsApi } from "../../api/courseSections";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const CourseSections: React.FC = () => {
  const { md } = Grid.useBreakpoint();
  const tabPosition = md ? "left" : "top";
  const tabSize = md ? "middle" : "small";

  const { percentDone, increasePercentDone } = useAssignmentsStore();
  const [notification, contextHolder] = antdNotification.useNotification();

  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  // const role = UserRoles.STUDENT;
  const { data: retrievedSections, courseId } = useLoaderData();

  const [activeKey, setActiveKey] = useState(
    retrievedSections.length ? String(retrievedSections[0].key) : "1"
  );
  const [sections, setSections] =
    useState<NonNullable<TabsProps["items"]>>(retrievedSections);
    const [refreshKey, setRefreshKey] = useState(0);

    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newSectionTitle, setNewSectionTitle] = useState("");

    const remove = (targetKey: TargetKey) => {
      const targetIndex = sections.findIndex((item) => item.key === targetKey);
      const newSections = sections.filter((item) => item.key !== targetKey);

      if (newSections.length && targetKey === activeKey) {
        const newActiveKey =
          newSections[
            targetIndex === newSections.length ? targetIndex - 1 : targetIndex
          ].key;
        setActiveKey(newActiveKey);
      }
      setSections(newSections);
    };

    const onEdit = async (targetKey: TargetKey, action: "add" | "remove") => {
      if (action === "remove") {
        try {
          const response = await courseSectionsApi.delete(targetKey as string);

          if (response.status === 200) {
            remove(targetKey);
            notification.success({
              message: "Success",
              description: "Section deleted successfully",
            });
          } else {
            throw new Error("Failed to delete section");
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description: "Failed to delete section. Please try again.",
          });
        }
      }
    };

    const updateTabLabel = async (key: string, newLabel: string) => {
      try {
        const section = sections.find((s) => s.key === key);
        if (!section) return;

        // Skip update if the new label is the same as the current one
        if (section.label === newLabel) {
          setEditingKey(null);
          return;
        }

        const sectionId = key;
        const response = await courseSectionsApi.update(sectionId, {
          id: +sectionId,
          title: newLabel,
          description: "", // Keep existing description
          order: 0, // Keep existing order
          course_id: courseId,
        });

        if (response.status === 200) {
          setSections((prev) =>
            prev.map((tab) =>
              tab.key === key ? { ...tab, label: newLabel } : tab
            )
          );
          notification.success({
            message: "Success",
            description: "Section title updated successfully",
          });
        } else {
          throw new Error("Failed to update section title");
        }
      } catch (error) {
        console.error("Failed to update section title:", error);
        notification.error({
          message: "Error",
          description: "Failed to update section title. Please try again.",
        });
      }
    };

    const renderTabLabel = (item: NonNullable<TabsProps["items"]>[number]) => {
      if (item.key === editingKey) {
        return (
          <Input
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onBlur={() => {
              updateTabLabel(item.key as string, editingText);
              setEditingKey(null);
            }}
            onPressEnter={() => {
              updateTabLabel(item.key as string, editingText);
              setEditingKey(null);
            }}
            autoFocus
            size="small"
          />
        );
      }
      return (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "8rem",
            display: "inline-block",
          }}
          onClick={() => {
            setEditingKey(item.key as string);
            setEditingText(typeof item.label === "string" ? item.label : "");
          }}
        >
          {item.label}
        </span>
      );
    };

    const showModal = () => {
      setIsModalVisible(true);
    };

    const handleOk = async () => {
      if (!newSectionTitle.trim()) return;

      try {
        const newSectionData: CreateCourseSection = {
          title: newSectionTitle,
          order: sections.length,
        };

        const response = await courseSectionsApi.create(
          courseId,
          newSectionData
        );

        if (response.status === 201) {
          const newSection = response.data;
          setSections([
            ...sections,
            {
              label: newSection.title,
              key: newSection.id,
              children: (
                <AssignmentsList
                  refreshKey={refreshKey}
                  courseId={courseId}
                  sectionId={newSection.id}
                />
              ),
            },
          ]);
          setActiveKey(String(newSection.id));
          setNewSectionTitle("");
          setIsModalVisible(false);
          notification.success({
            message: "Success",
            description: "Section created successfully",
          });
        } else {
          throw new Error("Failed to create section");
        }
      } catch (error) {
        console.error("Failed to create section:", error);
        notification.error({
          message: "Error",
          description: "Failed to create section. Please try again.",
        });
      }
    };

    const handleCancel = () => {
      setIsModalVisible(false);
    };

    const tabsItems = useMemo(
      () =>
        sections.map((section) => ({
          ...section,
          label: renderTabLabel(section),
          children: (
            <AssignmentsList
              key={`section-${section.key}-${refreshKey}`}
              refreshKey={refreshKey}
              courseId={courseId}
              sectionId={+section.key}
            />
          ),
        })),
      [sections, editingKey, editingText]
    );

    return (
      <Flex vertical align="center" gap={20}>
        {contextHolder}
        <TitleComp>Assignments</TitleComp>
        {role === UserRoles.TEACHER && (
          <Button
            onClick={showModal}
            style={{ alignSelf: "flex-start", width: "7.5rem" }}
            type="link"
          >
            Add Section
          </Button>
        )}
        {/* {role === UserRoles.STUDENT && (
        <Progress percent={percentDone} type="line" />
      )} */}
        {sections.length ? (
          <Tabs
            type="editable-card"
            size={tabSize}
            tabPosition={tabPosition}
            hideAdd
            className={classes.tabs}
            activeKey={activeKey}
            onChange={setActiveKey}
            onEdit={onEdit}
            items={tabsItems}
          />
        ) : (
          <Flex justify="center" style={{ width: "100%" }}>
            There're no sections yet
          </Flex>
        )}
        {role === UserRoles.TEACHER && (
          <Modal
            title="Add Section"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Input
              placeholder="Section Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </Modal>
        )}
      </Flex>
    );
};

export default CourseSections;

export const loader = async ({ params }: { params: Params }) => {
  const { courseId } = params;

  try {
    const response = await courseSectionsApi.getAllByCourse(courseId || "");

    if (response.status === 200) {
      const data = response.data.map((section: CourseSection) => ({
        key: section.id,
        label: section.title,
      }));
      return { courseId, data };
    }

    return { courseId, data: [] };
  } catch (error) {
    console.error("Failed to fetch course sections:", error);
    return { courseId, data: [] };
  }
};
