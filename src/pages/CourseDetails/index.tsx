import { useLoaderData, Link, Params, useNavigate } from "react-router";
import { Button, Typography, Divider, Row, Col, Flex, theme } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { userAvailableCourseActionsDetailsPage } from "../../constants/availableCourseActions";
import { Course, CourseActionConfig } from "../../models/Course";
import CourseActionsComp from "../../components/CourseActions";
import { coursesApi } from "../../api/courses";
import { PATHS } from "../../routes/paths";

const { Title, Paragraph, Text } = Typography;

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorPrimaryActive, colorTextSecondary, colorTextBase },
  } = theme.useToken();

  const availableActions: CourseActionConfig[] =
    userAvailableCourseActionsDetailsPage.student;

  const course: Course = useLoaderData();
  if (!course) {
    navigate(PATHS.HOME.link);
  }

  return (
    <>
      {course && (
        <Flex vertical gap={20} style={{ height: "100%" }}>
          <Link
            to={".."}
            relative="path"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button type="dashed">
              Go Back
              <RollbackOutlined />
            </Button>
          </Link>
          <Flex
            vertical
            gap={25}
            style={{
              maxWidth: "1200px",
              margin: "auto",
              height: "100%",
            }}
          >
            <Title level={2} style={{ color: colorPrimaryActive }}>
              {course.title}
            </Title>

            <Paragraph
              style={{
                fontSize: "18px",
                color: colorTextSecondary,
                lineHeight: "1.8",
                textAlign: "justify",
                margin: "0",
              }}
            >
              {course.description}
            </Paragraph>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text
                  strong
                  style={{ fontSize: "16px", color: colorPrimaryActive }}
                >
                  Lessons Count:{" "}
                </Text>
                <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                  {course.lessons_count}
                </Paragraph>
              </Col>
              <Col span={12}>
                <Text
                  strong
                  style={{ fontSize: "16px", color: colorPrimaryActive }}
                >
                  Lessons Duration:{" "}
                </Text>
                <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                  {course.lessons_duration}{" "}
                  {course.lessons_duration <= 1 ? "hour" : "hours"}
                </Paragraph>
              </Col>
            </Row>
            <CourseActionsComp course={course} actions={availableActions} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CourseDetails;

export async function loader({ params }: { params: Params }) {
  const response = await coursesApi.getById(params.courseId || "");
  // console.log("course res", response);

  if (response.status === 200) {
    return response.data;
  }

  return null;
}
