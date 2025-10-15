const env = process.env;

const config = {
  listPerPage: env.LIST_PER_PAGE || 10,
  dropdownLength: 5,
  omdb_key: "797653cf"  // this would not normally be in the repository, it is left in to allow for easier testing
}

module.exports = config;