const auth = require("../utils/middleware/authMiddleware").authMiddleware;
const Board = require("../models/Board");
const Card = require("../models/Card");
const CheckList = require("../models/CheckList");
const ChecklistTask = require("../models/ChecklistTask");
const Comment = require("../models/Comment");
const ObjectID = require("mongodb").ObjectID;
const router = require("express").Router();

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

const getSource = (lists, id) => {
  const listId = new ObjectID(id);
  const sourceList = lists.filter((list) => listId.equals(list._id));
  return sourceList[0];
};

router.patch("/:boardId/new-card", auth, async (req, res) => {
  const _id = req.params.boardId;
  const { card, listId } = req.body;
  let board;
  try {
    board = await Board.findOne({ _id, owner: req.user._id });

    if (!board) {
      board = await Board.findOne({ _id });
      board.validateBoardMember(req.user._id);
    }

    const newCard = new Card({ ...card });
    const sourceList = getSource(board.lists, listId);
    sourceList.cards.push(newCard);

    board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);

    board.updateActivity(req.user.fname, "addNewCard");

    await updateBoardLists(_id, board.lists);

    res.send(board);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.patch("/:boardId/create-checklist", auth, async (req, res) => {
  const _id = req.params.boardId;
  const { checklist, cardId, listId } = req.body;
  let board;
  try {
    board = await Board.findOne({ _id, owner: req.user._id });

    if (!board) {
      board = await Board.findOne({ _id });
      board.validateBoardMember(req.user._id);
    }

    const checkListItem = new CheckList({ ...checklist });

    const sourceList = getSource(board.lists, listId);
    const sourceCard = getSource(sourceList.cards, cardId);

    sourceCard.checklists.push(checkListItem);

    sourceList.cards.splice(
      sourceList.cards.indexOf(sourceCard),
      1,
      sourceCard
    );

    board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);

    board.updateActivity(req.user.fname, "addChecklistItem");
    await updateBoardLists(_id, board.lists);

    res.send(board);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/:boardId/checklist-task", auth, async (req, res) => {
  const { boardId } = req.params;
  const { task, cardId, listId, checkListId } = req.body;

  try {
    const taskItems = task.split("\n");
    const board = await Board.findById({ _id: boardId });
    const sourceList = getSource(board.lists, listId);
    const sourceCard = getSource(sourceList.cards, cardId);
    let checklist = getSource(sourceCard.checklists, checkListId);
    let data;

    taskItems.map(async (item, index) => {
      const taskItem = new ChecklistTask({ description: item });

      checklist = { ...checklist, archived: false, status: "doing" };
      checklist.tasks.push(taskItem);

      sourceCard.checklists.splice(
        sourceCard.checklists.indexOf(checklist),
        1,
        checklist
      );

      sourceList.cards.splice(
        sourceList.cards.indexOf(sourceCard),
        1,
        sourceCard
      );
      board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);

      const newBoard = await updateBoardLists(boardId, board.lists);

      data = { board: newBoard, checklist, card: sourceCard };

      if (index + 1 === taskItems.length) return res.status(203).send(data);
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.patch("/:boardId/update-card", auth, async (req, res) => {
  const { newCard, listId } = req.body;
  const { boardId } = req.params;

  try {
    const board = await Board.findById({ _id: boardId });

    const sourceList = getSource(board.lists, listId);
    const sourceIndex = board.lists.indexOf(sourceList);
    const sourceCard = getSource(sourceList.cards, newCard._id);
    const cardIndex = sourceList.cards.indexOf(sourceCard);

    sourceList.cards.splice(cardIndex, 1, newCard);
    board.lists.splice(sourceIndex, 1, sourceList);

    await updateBoardLists(boardId, board.lists);

    res.send(board);
  } catch (error) {
    res.status(400).send({ message: "Failed to update card" });
  }
});

router.patch("/:boardId/comment", auth, async (req, res) => {
  const _id = req.params.boardId;
  const { comment, cardId, listId } = req.body;
  let board;
  try {
    board = await Board.findOne({ _id, owner: req.user._id });

    if (!board) {
      board = await Board.findOne({ _id });
      board.validateBoardMember(req.user._id);
    }

    const newComment = new Comment({
      comment,
      creator: req.user.fname,
    });

    newComment.save();

    const sourceList = getSource(board.lists, listId);
    const sourceCard = getSource(sourceList.cards, cardId);

    sourceCard.comments.push(newComment);

    sourceList.cards.splice(
      sourceList.cards.indexOf(sourceCard),
      1,
      sourceCard
    );

    board.lists.splice(board.lists.indexOf(sourceList), 1, sourceList);
    board.updateActivity(req.user.fname, "addComment");

    await updateBoardLists(_id, board.lists);

    board.save();

    res.status(201).send(sourceCard);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});
module.exports = router;
