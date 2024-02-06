const express = require("express");
const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/contactsControllers.js");

const validateBody = require("../middlewares/validateBody.js");
const isValidId = require("../middlewares/isValidId.js");

const {
  createContactSchema,
  updateFavoriteSchema,
} = require("../schemas/contactsSchemas.js");

const authMiddleware = require("../middlewares/authMiddleware.js");

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware, getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", authMiddleware, isValidId, deleteContact);

contactsRouter.post(
  "/",
  authMiddleware,

  validateBody(createContactSchema),
  createContact
);

contactsRouter.put("/:id", validateBody(createContactSchema), updateContact);
contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = contactsRouter;
