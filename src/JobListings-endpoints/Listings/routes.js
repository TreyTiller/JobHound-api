const express = require('express')
const xss = require('xss')
const logger = require('../../logger')
const ListingService = require('./services')
const listingsRouter = express.Router()
const bodyParser = express.json()

const serializeListing = listing => ({
  id: xss(listing.id),
  title: xss(listing.title),
  company_name: xss(listing.company_name),
  source: xss(listing.source),
  location: xss(listing.location),
  contact: xss(listing.contact),
  phone: xss(listing.phone),
  email: xss(listing.email),
  stage: xss(listing.stage),
  notes: xss(listing.notes),
  listing: xss(listing.listing),
  date_interviewed: xss(listing.date_interviewed),
  date_appllied: xss(listing.date_appllied),
  user_id: xss(listing.user_id),
})

listingsRouter
.route('/')
.get((req, res, next) => {
    ListingService.getAllListings(req.app.get('db'), req.user.id)
      .then(listings => {
        res.json(listings.map(serializeListing))
      })
      .catch(next)
  })
.post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'company_name', 'stage']) {
      if (!req.body[field]) {
        logger.error(`${field} is required`)
        return res.status(400).send({
          error: { message: `'${field}' is required` }
        })
      }
    }

    const { title, company_name, source, location, contact, phone, email, stage, notes, listing, date_interviewed, date_appllied } = req.body

    const newlisting = { title, company_name, source, location, contact, phone, email, stage, notes, listing, date_interviewed, date_appllied, user_id: req.user.id }

    ListingService.insertListing(
      req.app.get('db'),
      newlisting
    )
      .then(listing => {
        logger.info(`Job Listing with id ${listing.id} created.`)
        res
          .status(201)
          .location(`/${listing.id}`)
          .json(serializeListing(listing))
      })
      .catch(next)
  })

  listingsRouter
  .route('/:listing_id')
  .all((req, res, next) => {
    const { listing_id } = req.params
    ListingService.getById(req.app.get('db'), listing_id)
      .then(listing => {
        if (!listing) {
          logger.error(`Listing with id ${recipe_id} not found.`)
          return res.status(404).json({
            error: { message: `Listing Not Found` }
          })
        }
        res.listing = listing
        next()
      })
      .catch(next)
  })
  .get((req, res) => {
    res.json(serializeListing(res.listing))
  })
  .delete((req, res, next) => {
    const { listing_id } = req.params
    ListingService.deleteListing(
      req.app.get('db'),
      listing_id
    )
      .then(numRowsAffected => {
        logger.info(`Listing with id ${listing_id} deleted.`)
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = listingsRouter