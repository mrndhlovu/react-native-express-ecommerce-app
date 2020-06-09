const router = require("express").Router();
const fetch = require("node-fetch");
const Board = require("../models/Board");
const List = require("../models/List");
const User = require("../models/User");
const auth = require("../utils/middleware/authMiddleware").authMiddleware;
const {
  viewedRecentMiddleware,
  defaultTemplates,
} = require("../utils/middleware/boardMiddleWare");
const { sendInvitationEmail } = require("../utils/middleware/emailMiddleware");
const {
  ROOT_URL,
  allowedBoardUpdateFields,
  IMAGES_EP,
} = require("../utils/config");
const ObjectID = require("mongodb").ObjectID;
const Notification = require("../models/Notification");

const createUserNotification = async (email, message) => {
  await User.findOne({ email }).then((user) => {
    const notification = new Notification({ ...message });
    user.notifications.push(notification);
    return user.save();
  });
};

router.get("/", auth, async (req, res) => {
  const match = {};
  if (req.query.archived) match.archived = req.query.archived === "true";

  try {
    let boards = [];
    const userId = new ObjectID(req.user._id);

    const getBoards = async () => {
      const allBoards = await Board.find();

      Object.keys(allBoards).map((index) => {
        allBoards[index].members.map((member) => {
          const boardId = new ObjectID(member.id);
          boardId.equals(userId) &&
            boards.push(allBoards[index]) &&
            allBoards[index].populate("owner").execPopulate();
        });
      });
    };

    await getBoards();

    res.send(boards);
  } catch (error) {
    res.status(400).send("Failed to retrieve user boards!");
  }
});

router.get("/id/:boardId", auth, viewedRecentMiddleware, async (req, res) => {
  const _id = req.params.boardId;

  let board;
  try {
    board = await Board.findOne({ _id, owner: req.user._id });

    if (!board) {
      board = await Board.findOne({ _id });
      !board.isTemplate && board.validateBoardMember(req.user._id);
    }

    await board.populate("owner").execPopulate();

    res.send(board);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.delete("/:boardId/delete-board", auth, async (req, res) => {
  const _id = req.params.boardId;

  try {
    const { starred, viewedRecent } = req.user;

    starred.includes(_id) && starred.splice(starred.indexOf(_id), 1);
    viewedRecent.includes(_id) &&
      viewedRecent.splice(viewedRecent.indexOf(_id), 1);
    req.user.save();

    await Board.findById({ _id }).then((board) => {
      board.members.map((member) => {
        if (member.isAdmin) return board.delete();
        throw "Access level limited! Only admin can delete a board!";
      });
    });

    res.send({ message: "Board deleted" });
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

router.patch("/id/:boardId/invite", auth, async (req, res) => {
  const _id = req.params.boardId;
  const { email } = req.body;
  const redirectLink = `${ROOT_URL}/#/boards/id/${_id}?via=invite`;

  const DEFAULT_ACCESS_LEVELS = { private: false, public: false, team: false };
  try {
    const board = await Board.findOne({ _id, owner: req.user._id });
    const invitedUser = await User.findOne({ email });

    const member = {
      id: invitedUser._id,
      isAdmin: false,
      fname: invitedUser.fname,
    };
    board.members.push(member);

    board.accessLevel = {
      ...board.accessLevel,
      ...DEFAULT_ACCESS_LEVELS,
      team: true,
    };

    const message = {
      subject: `${req.user.fname}, you have been invited by ${req.user.fname} to access their board`,
      description: `${req.user.fname}, click on this link: \n ${redirectLink}\n to accept the invitation or ignore the message if you do not accept the invitation!`,
    };

    await createUserNotification(email, message);
    sendInvitationEmail(email, message);
    board.save();
    res.send({ message: "User invited and added to board members!" });
  } catch (error) {
    res.status(400).send({ message: "User with that email was not found!" });
  }
});

router.patch("/:boardId/update-board", auth, async (req, res) => {
  const _id = req.params.boardId;

  let board;
  const updates = Object.keys(req.body);

  const isValidField = updates.every((update) =>
    allowedBoardUpdateFields.includes(update)
  );

  if (!isValidField)
    return res.status(400).send({ message: "Invalid update field" });
  try {
    board = await Board.findOne({ _id, owner: req.user._id });

    if (!board) {
      try {
        board = await Board.findOne({ _id });
        board.validateBoardMember(req.user._id);
      } catch (error) {
        return res.status(400).send({ message: error.message });
      }
    }

    updates.forEach((update) => (board[update] = req.body[update]));
    board.save();
    res.send(board);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/create-board", auth, async (req, res) => {
  const board = new Board({
    ...req.body,
    owner: req.user._id,
  });
  const member = {
    id: `${req.user._id}`,
    isAdmin: true,
    fname: req.user.fname,
  };
  board.members.push(member);

  try {
    const savedBoard = await board.save();
    res.send(savedBoard);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.post("/:boardId/create-list", auth, async (req, res) => {
  const _id = req.params.boardId;

  try {
    const list = new List({ ...req.body, cards: [] });
    const board = await Board.findOne({ _id, owner: req.user._id });
    board.lists.push(list);
    await board.save();
    res.status(203).send(board);
  } catch (error) {
    res.status(400).send({ message: "Failed to create a new list!" });
  }
});

router.post("/create-template", auth, async (req, res) => {
  const { template } = req.body;
  try {
    const { lists } = template;
    const board = new Board({ ...template, lists: [], owner: req.user._id });

    const member = {
      id: `${req.user._id}`,
      isAdmin: true,
      fname: req.user.fname,
    };
    board.members.push(member);

    lists.map((list) => {
      const newList = new List({ ...list });
      board.lists.push(newList);
    });

    await createUserNotification(req.user.email, {
      subject: "New templated created",
      description: `Template created from ${template.title} board!`,
    });

    await board.save();
    res.status(203).send(board);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/images", auth, async (req, res) => {
  const { page, query, orientation } = req.query;
  try {
    fetch(`${IMAGES_EP}&query=${query}&page=${page}&orientation=${orientation}`)
      .then((res) => res.json())
      .then((body) => res.status(203).send(body));
  } catch (error) {
    res.status(400).send({
      message: "Failed to get images at this time, please try in 5 minutes.",
    });
  }
});

router.get("/templates", auth, defaultTemplates, async (req, res) => {
  try {
    res.status(203).send([...req.templates]);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

module.exports = router;
