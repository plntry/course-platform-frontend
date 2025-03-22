import { create } from "zustand";
import { CourseAssignment } from "../models/Course";

interface AssignmentsState {
  assignments: CourseAssignment[];
  loading: boolean;
  currentEditingAssignment: CourseAssignment | null;
  isModalVisible: boolean;
  fetchAssignments: (sectionId: number) => Promise<void>;
  addAssignment: (assignmentData: Omit<CourseAssignment, "id">) => void;
  editAssignment: (updatedAssignment: CourseAssignment) => void;
  deleteAssignment: (id: number) => void;
  showAddModal: () => void;
  showEditModal: (assignment: CourseAssignment) => void;
  hideModal: () => void;
}

export const useAssignmentsStore = create<AssignmentsState>((set, get) => ({
  assignments: [],
  loading: false,
  currentEditingAssignment: null,
  isModalVisible: false,

  fetchAssignments: async (sectionId: number) => {
    set({ loading: true });
    try {
      // Replace this with your actual API call.
      const dummyData: CourseAssignment[] = [
        {
          id: 1,
          title: "Dummy Assignment 1",
          description: "Description for Assignment 1",
          due_date: "2025-03-20T11:16:19.325Z",
          teacher_comments: "Teacher comments for A1",
          files: "FileA1.pdf",
        },
        {
          id: 2,
          title: "Dummy Assignment 2",
          description: "Description for Assignment 2",
          due_date: "2025-03-26T11:16:19.325Z",
          teacher_comments: "Teacher comments for A2",
          files: "FileA2.pdf",
        },
      ];
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ assignments: dummyData, loading: false });
    } catch (error) {
      console.error("Error fetching assignments:", error);
      set({ loading: false });
    }
  },

  addAssignment: (assignmentData) => {
    const newId = Math.floor(Math.random() * 10000); // Replace with proper ID generation
    const newAssignment: CourseAssignment = { id: newId, ...assignmentData };
    set({ assignments: [...get().assignments, newAssignment] });
  },

  editAssignment: (updatedAssignment) => {
    set({
      assignments: get().assignments.map((a) =>
        a.id === updatedAssignment.id ? updatedAssignment : a
      ),
    });
  },

  deleteAssignment: (id: number) => {
    set({
      assignments: get().assignments.filter((a) => a.id !== id),
    });
  },

  showAddModal: () => {
    set({ currentEditingAssignment: null, isModalVisible: true });
  },

  showEditModal: (assignment: CourseAssignment) => {
    set({ currentEditingAssignment: assignment, isModalVisible: true });
  },

  hideModal: () => {
    set({ isModalVisible: false });
  },
}));
