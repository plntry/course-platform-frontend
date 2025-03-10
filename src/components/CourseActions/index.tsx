import { Button, Col, Row } from "antd";
import { Link } from "react-router";
import { useState } from "react";
import { GetCourse, CourseActionConfig } from "../../models/Course";
import DeleteModal from "../DeleteModal";
import { coursesApi } from "../../api/courses";

const CourseActionsComp: React.FC<{
  course: GetCourse;
  actions: CourseActionConfig[];
}> = ({ course, actions }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <Row
      gutter={[8, 8]}
      justify="center"
      style={{ display: "flex", flexWrap: "wrap" }}
    >
      {actions.map((action: CourseActionConfig) => (
        <Col key={action.link} style={{ flex: "1 1 auto", maxWidth: "200px" }}>
          {action.title === "Delete" ? (
            <>
              <Button
                {...action.buttonProps}
                block
                onClick={() => setShowDeleteModal(true)}
              >
                {action.title}
              </Button>
              {showDeleteModal && (
                <DeleteModal
                  data={course}
                  deleteRequest={async () => coursesApi.delete(course.id + "")}
                  onClose={() => setShowDeleteModal(false)}
                />
              )}
            </>
          ) : (
            <Link
              to={
                action?.dynamicParam
                  ? action.link.replace(
                      action.dynamicParam.stringToReplace,
                      course[action.dynamicParam.propName] + ""
                    )
                  : action.link
              }
            >
              <Button {...action.buttonProps} block>
                {action.title}
              </Button>
            </Link>
          )}
        </Col>
      ))}
    </Row>
  );
};

export default CourseActionsComp;
