import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button, theme, Flex } from "antd";
import { studentApi } from "../../api/students";
import { Student } from "../../models/Student";
import DeleteModal from "../DeleteModal";
import SearchInput from "../SearchInput";
import Loader from "../Loader";

const StudentsList: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      setLoading(true);
      try {
        const response = await studentApi.getAllStudentsByCourse(courseId);
        if (response.status === 200) {
          setStudents(response.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [courseId]);

  const filteredStudents = students.filter(
    (item) => item.email.toLowerCase().includes(searchText.toLowerCase())
    //  || item.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
    //   item.last_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDeleteSuccess = (deletedStudentId: number) => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== deletedStudentId)
    );
    setShowDeleteModal(false);
    setSelectedStudent(null);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Flex vertical gap={20} style={{ width: "100%" }}>
          <SearchInput onChange={(e) => setSearchText(e.target.value)} />
          <Row gutter={[16, 16]} style={{ width: "100%" }}>
            {filteredStudents.map((item) => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={`${item.first_name} ${item.last_name}`}
                  extra={
                    <Button
                      color="danger"
                      variant="filled"
                      onClick={() => {
                        setSelectedStudent(item);
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  }
                >
                  <p>{item.email}</p>
                </Card>
              </Col>
            ))}
          </Row>
          {showDeleteModal && selectedStudent && (
            <DeleteModal
              data={selectedStudent}
              deleteRequest={async () =>
                studentApi.deleteFromCourse(selectedStudent.id + "", courseId)
              }
              onClose={() => {
                setShowDeleteModal(false);
                setSelectedStudent(null);
              }}
              onSuccess={() => handleDeleteSuccess(selectedStudent.id)}
            />
          )}
        </Flex>
      )}
    </>
  );
};

export default StudentsList;
