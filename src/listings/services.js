const ListingsService = {
    getAllListings(knex, user_id) {
        return knex.select('*').from('job_listings').where({user_id}).orWhere({user_id: null}).orderBy("id", "desc")
      },

      insertListing(knex, newListing) {
        return knex
          .insert(newListing)
          .into('job_listings')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
}

module.exports = ListingsService;