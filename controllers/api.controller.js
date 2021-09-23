const db = require("../models")
const Ogloszenie = db.Ogloszenia
const { Op } = require("sequelize")

exports.getSingle = (req, res) => {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: "Id jest wymagane" })
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      res.json({
        ...response,
        images: response.images.split(",").map((item) => {
          return { image_path: "websiteUrl" + item }
        }),
      })
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}

exports.getAll = (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const skipIndex = (page - 1) * limit

  let where = Object.entries(req.query).length > 0 ? { [Op.and]: [] } : {}

  if (req.query.fraza) {
    where = {
      ...where,
      [Op.or]: [
        {
          tytul: {
            [Op.like]: `%${req.query.fraza}%`,
          },
        },
        {
          opis: {
            [Op.like]: `%${req.query.fraza}%`,
          },
        },
      ],
    }
  }

  if (req.query.rodzaj) {
    where[Op.and].push({
      rodzaj: req.query.rodzaj,
    })
  }

  if (req.query.gmina) {
    where[Op.and].push({
      gmina: req.query.gmina,
    })
  }

  if (req.query.powiat) {
    where[Op.and].push({
      powiat: req.query.powiat,
    })
  }

  if (req.query.typ) {
    where[Op.and].push({
      typ: req.query.typ,
    })
  }

  if (req.query.miasto) {
    where[Op.and].push({
      miasto: req.query.miasto,
    })
  }

  if (req.query.liczba_pokoi) {
    where[Op.and].push({
      liczba_pokoi: `%${req.query.liczba_pokoi}%`,
    })
  }

  if (req.query.powierzchniaOd && req.query.powierzchniaDo) {
    if (powierzchniaOd < powierzchniaDo) {
      where[Op.and].push({
        powierzchnia: {
          [Op.between]: [req.query.powierzchniaOd, req.query.powierzchniaDo],
        },
      })
    }
  } else if (req.query.powierzchniaOd) {
    where[Op.and].push({
      powierzchnia: {
        [Op.gte]: req.query.powierzchniaOd,
      },
    })
  } else if (req.query.powierzchniaDo) {
    where[Op.and].push({
      powierzchnia: {
        [Op.lte]: req.query.powierzchniaDo,
      },
    })
  }

  if (req.query.cenaOd && req.query.cenaDo) {
    if (cenaOd < cenaDo) {
      where[Op.and].push({
        cena: {
          [Op.between]: [req.query.cenaOd, req.query.cenaDo],
        },
      })
    }
  } else if (req.query.cenaOd) {
    where[Op.and].push({
      cena: {
        [Op.gte]: req.query.cenaOd,
      },
    })
  } else if (req.query.cenaDo) {
    where[Op.and].push({
      cena: {
        [Op.lte]: req.query.cenaDo,
      },
    })
  }

  const options = {
    offset: skipIndex,
    limit,
    raw: true,
    where: where,
  }

  Ogloszenie.findAll(options)
    .then((response) => {
      const results = response.map((item) => {
        return {
          ...item,
          images: item.images.split(",").map((item) => {
            return { image_path: "http://adminnieruchomosci.pl/" + item }
          }),
        }
      })
      return res.json(results)
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}
