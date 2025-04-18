import { Button, Divider, Flex, Input, theme } from "antd";
import TitleComp from "../Title";
import Comment from "../Comment";

const CommentsList: React.FC<{ shouldShowAddComment?: boolean }> = ({
  shouldShowAddComment = true,
}) => {
  const { token: themeToken } = theme.useToken();

  return (
    <Flex
      vertical
      justify="center"
      align="center"
      gap={16}
      style={{
        maxWidth: "40rem",
        width: "100%",
        margin: "0 auto",
      }}
    >
      <TitleComp
        props={{
          level: 3,
          style: { color: themeToken.colorPrimaryActive, marginTop: 0 },
        }}
      >
        Comments
      </TitleComp>
      {shouldShowAddComment && (
        <>
          <Input.TextArea
            rows={4}
            style={{ width: "100%" }}
            placeholder="Leave your comment..."
          />
          <Button type="primary" style={{ alignSelf: "flex-end" }}>
            Add Comment
          </Button>
          <Divider />
        </>
      )}
      <Flex vertical gap={16} style={{ width: "100%" }}>
        <Comment author="John Doe" content="This is a comment" />
        <Comment
          author="Jane Doe"
          content="This is another comment This is a comment This is a comment This is a comment This is a comment"
        />
      </Flex>
    </Flex>
  );
};

export default CommentsList;
