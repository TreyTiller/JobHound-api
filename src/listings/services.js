const ListingsService = {
  getAllListings(knex, user_id) {
    return knex
      .select("*")
      .from("job_listings")
      .where({ user_id })
      .orWhere({ user_id: null })
      .orderBy("id", "desc");
  },
  getById(knex, id) {
    return knex
      .from("job_listings")
      .select("*")
      .where("id", id)
      .first();
  },
  insertListing(knex, newListing) {
    return knex
      .insert(newListing)
      .into("job_listings")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  updateListing(knex, id, newListing) {
    return knex("job_listings")
      .where({ id })
      .update(newListing)
  },
  deleteListing(knex, id) {
    return knex("job_listings")
      .where({ id })
      .delete();
  }
};

module.exports = ListingsService;
