/* eslint-disable semi */
/* eslint-disable quotes */
const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

const updateContacts = async (_, data) => {
  await fs.writeFile(contactsPath, JSON.stringify(data));
};

module.exports = updateContacts;
