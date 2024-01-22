const { HttpError } = require("../helpers/HttpError.js");
const controllerWrapper = require("../helpers/controllerWrapper.js");
const contactsService = require("../services/contactsServices.js");

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  const result = await contactsService.addContact(name, email, phone);
  res.status(201).json(result);
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!(name || email || phone)) {
    throw HttpError(400, "Body must have at least one field");
  }
  const result = await contactsService.updateById(id, name, email, phone);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: controllerWrapper(getAllContacts),
  getOneContact: controllerWrapper(getOneContact),
  createContact: controllerWrapper(createContact),
  deleteContact: controllerWrapper(deleteContact),
  updateContact: controllerWrapper(updateContact),
};
