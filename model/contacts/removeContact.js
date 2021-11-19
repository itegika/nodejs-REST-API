/* eslint-disable semi */
/* eslint-disable quotes */
const updateContacts = require("./updateContacts");
const listContacts = require("./listContacts");

const removeContact = async (id) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === Number(id));
  if (idx === -1) {
    return null;
  }
  contacts.splice(idx, 1);
  await updateContacts(contacts);
  // return true;
  return idx;
};

module.exports = removeContact;
