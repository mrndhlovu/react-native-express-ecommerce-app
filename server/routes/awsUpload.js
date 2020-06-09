const router = require("express").Router();
const upload = require("../utils/upload-file");
const auth = require("../utils/middleware/authMiddleware").authMiddleware;
const Board = require("../models/Board");
const ObjectID = require("mongodb").ObjectID;

const updateBoardLists = (id, newLists) =>
  Board.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        lists: [...newLists],
        lastViewed: Date.now(),
      },
    }
  );

const uploadFile = (type, req, res, callback) => {
  const singleFileUpload = upload.single(type);
  singleFileUpload(req, res, () => callback());
};

const getSource = (lists, id) => {
  const listId = new ObjectID(id);
  const sourceList = lists.filter((list) => listId.equals(list._id));
  return sourceList[0];
};

router.post("/:type/:boardId/:listId/:cardId/upload", auth, (req, res) => {
  const { type, boardId, cardId, listId } = req.params;

  uploadFile(type, req, res, async (err) => {
    if (err) return res.json({ message: err.message, success: false });

    try {
      const { originalname, location } = req.file;
      const attachment = {
        url: location,
        uploadDate: Date.now(),
        name: originalname,
        filetype: originalname.split(".").pop(),
      };

      const board = await Board.findById({ _id: boardId });
      const sourceList = getSource(board.lists, listId);
      const sourceCard = getSource(sourceList.cards, cardId);
      sourceCard.attachments.push(attachment);

      sourceList.cards.splice(
        sourceList.cards.indexOf(sourceCard),
        1,
        sourceCard
      );

      board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);

      await updateBoardLists(boardId, board.lists);

      res.status(201).send({ card: sourceCard, board });
    } catch (error) {
      res.status(400).send({
        message: "Failed to upload, file type not supported",
      });
    }
  });
});

module.exports = router;
