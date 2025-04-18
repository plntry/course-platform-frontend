import { useLoaderData, useSearchParams } from "react-router";
import { assignmentFilesApi } from "../../api/files";
import { studentApi } from "../../api/students";
import { coursesApi } from "../../api/courses";
import TitleComp from "../../components/Title";
import { Divider, Flex, theme, Typography } from "antd";
import { useMemo } from "react";
import { capitalizeFirstLetter } from "../../utils/stringUtils";
import GoBackButton from "../../components/GoBackButton";
import { handleFileDownload } from "../../utils/fileUtils";
import GradeAssignmentForm from "../../components/GradeAssignmentForm";

const AssignmentsForReview: React.FC = () => {
  const { token: themeToken } = theme.useToken();
  const { student, course, submissions } = useLoaderData() as {
    student: any;
    course: any;
    submissions: any[];
  };

  const mainData = useMemo(() => {
    return {
      course: course.title,
      student: `${student.first_name} ${student.last_name}`,
    };
  }, [course, student]);

  const handleGradeSubmit = (values: { grade: string; feedback: string }) => {
    console.log("Grade submitted:", values);
    // TODO: Implement grade submission logic
  };

  return (
    <>
      <GoBackButton />
      <TitleComp>Assignments for Review</TitleComp>
      <Flex vertical>
        {Object.entries(mainData).map(([key, value]) => (
          <Typography.Text key={key} strong>
            <Typography.Text style={{ color: themeToken.colorPrimaryActive }}>
              {capitalizeFirstLetter(key)}
            </Typography.Text>
            : {value}
          </Typography.Text>
        ))}
      </Flex>
      <Divider />
      <Flex vertical gap={20}>
        {submissions.map((submission) => (
          <Flex key={submission.file_key} vertical gap={10}>
            <Flex justify="space-between" align="center">
              <Typography.Link
                onClick={() =>
                  handleFileDownload(submission.file_key, submission.filename)
                }
              >
                {submission.filename} (
                {(submission.file_size / 1024).toFixed(2)} KB)
              </Typography.Link>
            </Flex>
            <GradeAssignmentForm onGradeSubmit={handleGradeSubmit} />
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default AssignmentsForReview;

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const courseId = url.searchParams.get("course");
  const studentId = url.searchParams.get("student");

  if (!courseId || !studentId) {
    throw new Error("Course ID and Student ID are required");
  }

  const [studentsResponse, courseResponse, submissionsResponse] =
    await Promise.all([
      studentApi.getAllStudentsByCourse(courseId),
      coursesApi.getById(courseId),
      assignmentFilesApi.getSubmissionsByCourse(courseId, studentId),
    ]);

  if (
    studentsResponse.status === 200 &&
    courseResponse.status === 200 &&
    submissionsResponse.status === 200
  ) {
    const student = studentsResponse.data.find(
      (s: any) => s.id.toString() === studentId
    );
    if (!student) {
      throw new Error("Student not found");
    }

    return {
      student,
      course: courseResponse.data,
      submissions: submissionsResponse.data,
    };
  }

  return { student: {}, course: {}, submissions: [] };
}
