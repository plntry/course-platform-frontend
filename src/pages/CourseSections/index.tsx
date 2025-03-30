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
} from "antd";
import { Params, useLoaderData } from "react-router";
import { CourseSection } from "../../models/Course";
import AssignmentsList from "../../components/AssignmentsList";
import classes from "./CourseSections.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import TitleComp from "../../components/Title";
import { useAssignmentsStore } from "../../store/useAssignmentsStore";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const MemoizedAssignmentsList: React.FC<{ sectionId: number }> = React.memo(
  (props) => {
    return <AssignmentsList {...props} />;
  }
);

const CourseSections: React.FC = () => {
  const { md } = Grid.useBreakpoint();
  const tabPosition = md ? "left" : "top";
  const tabSize = md ? "middle" : "small";

  const { percentDone, increasePercentDone } = useAssignmentsStore();

  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const retrievedSections = useLoaderData();

  const [activeKey, setActiveKey] = useState("1");
  const [sections, setSections] =
    useState<NonNullable<TabsProps["items"]>>(retrievedSections);

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

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  const updateTabLabel = (key: string, newLabel: string) => {
    setSections((prev) =>
      prev.map((tab) => (tab.key === key ? { ...tab, label: newLabel } : tab))
    );
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

  const handleOk = () => {
    if (!newSectionTitle.trim()) return;
    const newKey = String(sections.length + 1);
    setSections([
      ...sections,
      {
        label: newSectionTitle,
        key: newKey,
        children: <AssignmentsList sectionId={+newKey} />,
      },
    ]);
    setActiveKey(newKey);
    setNewSectionTitle("");
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const tabsItems = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        label: renderTabLabel(section),
        children: <MemoizedAssignmentsList sectionId={+section.key} />,
      })),
    [sections, editingKey, editingText]
  );

  return (
    <Flex vertical align="center" gap={20}>
      <TitleComp>Assignments</TitleComp>
      {role === UserRoles.TEACHER && (
        <Button
          onClick={showModal}
          style={{ alignSelf: "flex-start", width: "7.5rem" }}
        >
          Add Section
        </Button>
      )}
      {role === UserRoles.STUDENT && (
        <Progress percent={percentDone} type="line" />
      )}
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
  // TODO: add getting sections for course when the API is done
  const data: CourseSection[] = [
    {
      title: "Section 1",
      id: 1,
    },
    {
      title: "Section 2",
      id: 2,
    },
  ];

  return data.map((el) => ({ key: el.id, label: el.title }));
};
