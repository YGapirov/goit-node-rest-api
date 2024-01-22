const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "..", "db", "contacts.json"); //пас джоін обєднання шляху до поточного каталогу, папки і імелі файлу

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8"); //parse сам робе ютф-8, можем не прописувати
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId); //пошук книжки яку треба видалити
  if (index === -1) return null; //якщо книжку не знайшли повернули нал
  const [result] = contacts.splice(index, 1); //повернувся масив з одним елементов видаленим, і записали в змінну
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

async function updateById(contactId, name, email, phone) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === contactId); //пошук книжки яку треба видалити
  if (index === -1) return null; //якщо книжку не знайшли повернули нал
  contacts[index] = { id: contactId, name, email, phone };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateById,
};
