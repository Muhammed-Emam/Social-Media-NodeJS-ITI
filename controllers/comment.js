import Comment from "../db/models/comment.js";

const getCommentByID = async (req, res, next) => {
  const { comment_id } = req.params;
  const comment = await Comment.findOne({ _id: comment_id });
  res.send(comment);
};

const deleteComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const comment = await Comment.findByIdAndDelete(comment_id);
  res.status(200).json({
    statusCode: 200,
    message: "Comment has been Successfully deleted",
    data: comment,
  });
};

const updateComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const { content } = req.body;
  await Comment.updateOne(
    { _id: comment_id },
    {
      content,
      data: new Date(),
    }
  );
  const updatedComment = await Comment.findOne({ _id: comment_id });
  res.status(200).json({
    statusCode: 200,
    message: "Comment has been Successfully updated",
    data: updatedComment,
  });
};

export { getCommentByID, deleteComment, updateComment };
