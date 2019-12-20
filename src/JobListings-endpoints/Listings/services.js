const ListingService = {
    getAllListings(knex, user_id) {
        return knex.select('*').from('job_listings').where({user_id}).orWhere({user_id: null}).orderBy("id", "desc")
      },
      getById(knex, id) {
        return knex.from('job_listings').select('*').where('id', id).first();
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
    deleteListing(knex, user_id) {
        return knex('job_listings')
          .where({ user_id })
          .orWhere({id})
          .delete()
      },
      updateListing(knex, id, user_id, newListingFields) {
        return knex('job_listings')
          .where({ id, user_id })
          .update(newListingFields)
      },
  }
  
  module.exports = ListingService