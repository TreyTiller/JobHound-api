const ListingService = {
    getAllListings(knex) {
        return knex.select('*').from("job_listings")
    }
}

module.exports = ListingService