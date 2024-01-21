const { httpError } = require("../helpers");
const contactsService = require("../services/contactsServices.js");

const getAllContacts = async (req, res) => {
  try {
    const result = await contactsService.listContacts();

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getContactById(id);
    if (!result) {
      throw httpError(404);
    }
    res.json(result);
  } catch (error) {
    const { status = 500, message } = error;
    res.status(status).json({ message });
  }
};

// const deleteContact = (req, res) => {};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const result = await contactsService.addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// const updateContact = (req, res) => {};

module.exports = {
  getAllContacts,
  getOneContact,
  createContact,
};
