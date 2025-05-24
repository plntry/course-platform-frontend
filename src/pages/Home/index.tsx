import { Carousel, Flex, Typography, Button } from "antd";
import { PATHS } from "../../routes/paths";
import TitleComp from "../../components/Title";

const containerStyle: React.CSSProperties = {
  width: "90%",
  maxWidth: "800px",
  margin: "0 auto",
  padding: "0 20px",
};

const contentStyle: React.CSSProperties = {
  height: "300px",
  color: "#fff",
  lineHeight: "300px",
  textAlign: "center",
  background: "linear-gradient(135deg, #1b4798 0%, #2a5cb8 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "20px",
  borderRadius: "8px",
  width: "100%",
};

const Home: React.FC = () => {
  return (
    <Flex vertical gap={20} style={containerStyle}>
      <TitleComp>Welcome to ProSkills</TitleComp>
      <Carousel autoplay>
        <div>
          <div style={contentStyle}>
            <Typography.Title level={1} style={{ color: "#fff", margin: 0 }}>
              Learn New Skills
            </Typography.Title>
            <Typography.Text style={{ color: "#fff" }}>
              Start your journey with our comprehensive courses
            </Typography.Text>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <Typography.Title level={2} style={{ color: "#fff", margin: 0 }}>
              Expert Instructors
            </Typography.Title>
            <Typography.Text style={{ color: "#fff" }}>
              Learn from industry professionals
            </Typography.Text>
          </div>
        </div>
        <div>
          <div style={contentStyle}>
            <Typography.Title level={2} style={{ color: "#fff", margin: 0 }}>
              Hands-on Projects
            </Typography.Title>
            <Typography.Text style={{ color: "#fff" }}>
              Apply your knowledge with real-world projects
            </Typography.Text>
          </div>
        </div>
      </Carousel>
      <Flex justify="center">
        <Button
          type="primary"
          size="large"
          style={{ maxWidth: "225px" }}
          href={PATHS.COURSES.link}
        >
          Browse Courses
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
