import { Button, Col, Row } from "antd";
import { Link } from "react-router";
import { Course, CourseActionConfig } from "../../models/Course";

const CourseActionsComp: React.FC<{
  course: Course;
  actions: CourseActionConfig[];
}> = ({ course, actions }) => {
  return (
    <Row
      gutter={[8, 8]}
      justify="center"
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {actions.map((action: CourseActionConfig) => (
        <Col key={action.link} style={{ flex: "1 1 auto", maxWidth: "200px" }}>
          <Link
            to={`${
              action?.dynamicParam
                ? action.link.replace(
                    action.dynamicParam.stringToReplace,
                    course[action.dynamicParam.propName] + ""
                  )
                : action.link
            }`}
          >
            <Button {...action.buttonProps} block>
              {action.title}
            </Button>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default CourseActionsComp;
