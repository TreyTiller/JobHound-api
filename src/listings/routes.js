const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const ListingsService = require('./services')
const { requireAuth } = require('../middleware/jwt-auth')
const listingsRouter = express.Router()
const bodyParser = express.json()

const serializeListing = listing => ({
    id: listing.id,
    title: xss(listing.title),
    company_name: xss(listing.company_name),
    stage: xss(listing.stage),
    source: xss(listing.source),
    location: xss(listing.location),
    contact: xss(listing.contact),
    phone: xss(listing.phone),
    email: xss(listing.email),
    notes: xss(listing.notes),
    listing: xss(listing.listing),
    date_interviewed: xss(listing.date_interviewed),
    date_appllied: xss(listing.date_appllied),
    user_id: xss(listing.user_id),
  })

  listingsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        ListingsService.getAllListings(req.app.get('db'), req.user.id)
          .then(listings => {
            res.json(listings.map(serializeListing))
          })
          .catch(next)
      })
      .post(requireAuth, bodyParser, (req, res, next) => {
        for (const field of ['title', 'company_name', 'location', 'stage']) {
          if (!req.body[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send({
              error: { message: `'${field}' is required` }
            })
          }
        }

        const { title, company_name, stage, source, location, contact, phone, email, notes, listing, date_interviewed, date_appllied } = req.body

        const newListing = { title, company_name, stage, source, location, contact, phone, email, notes, listing, date_interviewed, date_appllied, user_id: req.user.id }

        ListingsService.insertListing(
            req.app.get('db'),
            newListing
          )
          .then(listing => {
            logger.info(`Listing with id ${listing.id} created.`)
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
        ListingsService.getById(req.app.get('db'), listing_id)
          .then(listing => {
            if (!listing) {
              logger.error(`Listing with id ${listing_id} not found.`)
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
      .put(requireAuth, bodyParser, (req, res, next) => {
        for (const field of ['title', 'company_name', 'location', 'stage']) {
          if (!req.body[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send({
              error: { message: `'${field}' is required` }
            })
          }
        }

        const { title, company_name, stage, source, location, contact, phone, email, notes, listing, date_interviewed, date_appllied } = req.body

        const newListing = { id: req.param.listing_id, title, company_name, stage, source, location, contact, phone, email, notes, listing, date_interviewed, date_appllied, user_id: req.user.id }

        ListingsService.updateListing(
            req.app.get('db'),
            req.params.listing_id,
            newListing
          )
          .then(listing => {
            logger.info(`Listing with id ${newListing.id} updated.`)
            res
              .status(200)
              .json({newListing})
          })
          .catch(next)
      })
      
      .delete(requireAuth,(req, res, next) => {
        const { listing_id } = req.params
        ListingsService.deleteListing(
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