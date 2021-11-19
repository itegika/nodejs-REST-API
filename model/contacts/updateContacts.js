/* eslint-disable semi */
/* eslint-disable quotes */
const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

const updateContacts = async (_, body) => {
  await fs.writeFile(contactsPath, JSON.stringify(body));
};

module.exports = updateContacts;
