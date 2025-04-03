import React, { useMemo, useState } from "react";
import {
  Button,
  Flex,
  Grid,
  Input,
  Modal,
  Tabs,
  TabsProps,
  notification as antdNotification,
} from "antd";
import { Params, useLoaderData } from "react-router";
import { CourseSection, CreateUpdateCourseSection } from "../../models/Course";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import { courseSectionsApi } from "../../api/courseSections";
import AssignmentsList from "../../components/AssignmentsList";
import TitleComp from "../../components/Title";
import classes from "./CourseSections.module.css";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;
type Section = NonNullable<TabsProps["items"]>[number];

const CourseSections: React.FC = () => {
  // Grid and UI settings
  const { md } = Grid.useBreakpoint();
  const tabPosition = md ? "left" : "top";
  const tabSize = md ? "middle" : "small";

  // Notifications
  const [notification, contextHolder] = antdNotification.useNotification();

  // Auth and data
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const { data: retrievedSections, courseId } = useLoaderData();

  // State management
  const [sections, setSections] =
    useState<NonNullable<TabsProps["items"]>>(retrievedSections);
  const [activeKey, setActiveKey] = useState(
    retrievedSections.length ? String(retrievedSections[0].key) : "1"
  );

  // Section editing state
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(
    null
  );
  const [editingSectionTitle, setEditingSectionTitle] = useState<string>("");

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // Section management functions
  const handleSectionRemoval = (targetKey: TargetKey) => {
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

  const handleSectionEdit = async (
    targetKey: TargetKey,
    action: "add" | "remove"
  ) => {
    if (action === "remove") {
      try {
        const response = await courseSectionsApi.delete(targetKey as string);
        if (response.status === 200) {
          handleSectionRemoval(targetKey);
          notification.success({
            message: "Success",
            description: "Section deleted successfully",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to delete section. Please try again.",
        });
      }
    }
  };

  const handleSectionTitleUpdate = async (key: string, newLabel: string) => {
    try {
      const section = sections.find((s) => s.key === key);
      if (!section || section.label === newLabel) {
        setEditingSectionKey(null);
        return;
      }

      const response = await courseSectionsApi.update(key, {
        title: newLabel,
        order: 0,
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
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update section title. Please try again.",
      });
    } finally {
      setEditingSectionKey(null);
    }
  };

  // Render functions
  const renderSectionLabel = (item: Section) => {
    if (role !== UserRoles.TEACHER) {
      return <span>{item.label}</span>;
    }

    if (item.key === editingSectionKey) {
      return (
        <Input
          value={editingSectionTitle}
          onChange={(e) => setEditingSectionTitle(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          onBlur={() =>
            handleSectionTitleUpdate(item.key as string, editingSectionTitle)
          }
          onPressEnter={() =>
            handleSectionTitleUpdate(item.key as string, editingSectionTitle)
          }
          autoFocus
          size="small"
        />
      );
    }

    return (
      <span
        className={classes.sectionLabel}
        onClick={() => {
          setEditingSectionKey(item.key as string);
          setEditingSectionTitle(
            typeof item.label === "string" ? item.label : ""
          );
        }}
      >
        {item.label}
      </span>
    );
  };

  // Modal handlers
  const handleModalOk = async () => {
    if (!newSectionTitle.trim()) return;

    try {
      const response = await courseSectionsApi.create(courseId, {
        title: newSectionTitle,
        order: sections.length,
      });

      if (response.status === 201) {
        const newSection = response.data;
        setSections([
          ...sections,
          {
            label: newSection.title,
            key: newSection.id,
            children: (
              <AssignmentsList
                key={`section-${newSection.id}`}
                courseId={courseId}
                sectionId={newSection.id}
                isActive={activeKey === newSection.id}
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
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to create section. Please try again.",
      });
    }
  };

  // Memoized values
  const tabsItems = useMemo(
    () =>
      sections.map((section) => {
        const sectionId = Number(section.key);
        return {
          ...section,
          label: renderSectionLabel(section),
          children: (
            <AssignmentsList
              key={`section-${sectionId}`}
              courseId={Number(courseId)}
              sectionId={sectionId}
              isActive={activeKey === section.key}
            />
          ),
        };
      }),
    [
      sections,
      editingSectionKey,
      editingSectionTitle,
      courseId,
      role,
      activeKey,
    ]
  );

  return (
    <Flex vertical align="center" gap={20}>
      {contextHolder}
      <TitleComp>Assignments</TitleComp>

      {role === UserRoles.TEACHER && (
        <Button
          onClick={() => setIsModalVisible(true)}
          style={{ alignSelf: "flex-start", width: "7.5rem" }}
          type="link"
        >
          Add Section
        </Button>
      )}

      {sections.length ? (
        <Tabs
          type={role === UserRoles.TEACHER ? "editable-card" : "card"}
          size={tabSize}
          tabPosition={tabPosition}
          hideAdd
          className={classes.tabs}
          activeKey={activeKey}
          onChange={setActiveKey}
          onEdit={role === UserRoles.TEACHER ? handleSectionEdit : undefined}
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
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
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
    const data =
      response.status === 200
        ? response.data.map((section: CourseSection) => ({
            key: section.id,
            label: section.title,
          }))
        : [];

    return { courseId, data };
  } catch (error) {
    console.error("Failed to fetch course sections:", error);
    return { courseId, data: [] };
  }
};
