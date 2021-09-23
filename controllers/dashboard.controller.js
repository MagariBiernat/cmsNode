const db = require("../models")
const Ogloszenie = db.Ogloszenia
const { Op } = require("sequelize")
const Upload = require("../config/uploadFiles")
const validateAddInput = require("../validators/add")

exports.getDashboard = (req, res) => {
  Ogloszenie.findAll({ raw: true })
    .then((data) => {
      return res.render("dashboard", {
        user: req.user,
        isAuthenticated: true,
        title: "CMS - dashboard",
        allOgloszenia: data.length,
      })
    })
    .catch((err) => {
      console.log(err)
      req.flash("error", err)
      res.render("dashboard", {
        user: req.user,
        isAuthenticated: true,
        title: "CMS - dashboard",
        allOgloszenia: "error",
      })
    })
}

exports.getDashboardAll = (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 50

  const skipIndex = (page - 1) * limit

  console.log("req.query :")
  console.log(req.query)

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

  Ogloszenie.findAndCountAll(options)
    .then((results) => {
      return res.render("dashboardAll", {
        isAuthenticated: true,
        title: "CMS - wszystkie ogłoszenia",
        data: results.rows,
        page,
        totalPages: Math.ceil(results.count / 50),
      })
    })
    .catch((err) => {
      req.flash("error", err)
      return res.redirect("/admin/dashboard")
    })
}

exports.getDashboardAdd = (req, res) => {
  const message = req.session.message
  res.render("dashboardAdd", {
    isAuthenticated: true,
    title: "CMS - dodawanie ogłoszenia",
    message: message,
  })
}

exports.postDashboardAdd = (req, res) => {
  Upload.upload(req, res, async function (err) {
    if (err) {
      console.log(err)
      req.flash("error", err.message)
      return res.redirect("/admin/dashboard/add")
    } else if (req.files.length == 0) {
      req.flash("error", "Zdjęcia są wymagane")
      return res.redirect("/admin/dashboard/add")
    }
    const { errors, isValid } = validateAddInput(req.body)

    if (!isValid) {
      req.flash("error", errors)
      return res.redirect("/admin/dashboard/add")
    }

    let images = req.files.map((item) => item.path).join(",")

    const newOgloszenie = ({
      tytul,
      opis,
      rodzaj,
      typ,
      powierzchnia,
      miasto,
      ulica,
      cena,
      liczba_pokoi,
      wojewodztwo,
      gmina,
      powiat,
    } = req.body)

    Ogloszenie.create({ ...newOgloszenie, images }, { raw: true })
      .then(() => {
        req.flash("success_msg", "Dodano ogłoszenie")
        return res.redirect("/admin/dashboard/add")
      })
      .catch((err) => {
        if (req.files) {
          deleteFiles(req.files)
        }
        req.flash("error", "Wystapił error :" + err)
        return res.redirect("/admin/dashboard/add")
      })
  })
}

exports.getDashboardSingle = (req, res) => {
  const { id } = req.params

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      res.render("dashboardSingle", {
        images: response.images !== "" ? response.images.split(",") : null,
        ogloszenie: response,
        isAuthenticated: true,
        title: "CMS - ogłoszenie " + id,
      })
    })
    .catch((err) => {
      req.flash("error", "Wystąpił problem : " + err)
      res.redirect("/admin/dashboard")
    })
}

exports.getDashboardSingleEdit = (req, res) => {
  const { id } = req.params

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      Object.keys(response).forEach((key) => {
        response[key] = "" + response[key]
      })

      return res.render("dashboardSingleEdit", {
        images: response.images !== "" ? response.images.split(",") : null,
        ogloszenie: response,
        id,
        isAuthenticated: true,
        title: "CMS - edycja ogłoszenia " + id,
      })
    })
    .catch((err) => {
      console.log(err)
      req.flash("error", "Wystąpił problem : " + err)
      res.redirect("/admin/dashboard")
    })
}

exports.postDashboardSingleEdit = (req, res) => {
  const { id } = req.params

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard/all")
  }

  Ogloszenie.update(
    {
      tytul: req.body.tytul,
      opis: req.body.opis,
      rodzaj: req.body.rodzaj,
      typ: req.body.typ,
      powierzchnia: req.body.powierzchnia,
      miasto: req.body.miasto,
      ulica: req.body.ulica,
      cena: req.body.cena,
      liczba_pokoi: req.body.liczba_pokoi,
      wojewodztwo: req.body.wojewodztwo,
      gmina: req.body.gmina,
      powiat: req.body.powiat,
    },
    { where: { ogloszenieId: id } }
  )
    .then((response) => {
      console.log(response)
      req.flash("success_msg", "Edytowano ogłoszenie")
      return res.redirect("/admin/dashboard/edit/" + id)
    })
    .catch((err) => {
      req.flash("error", "Wystapił error :" + err)
      return res.redirect("/admin/dashboard/edit/" + id)
    })
}

exports.postDashboardSingleDelete = async (req, res) => {
  const { id } = req.params

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      let { images } = response
      images = images.split(",").map((item) => {
        return {
          path: item,
        }
      })

      Upload.deleteFiles(images)
      return Ogloszenie.destroy({
        where: {
          ogloszenieId: id,
        },
      })
    })
    .then((success) => {
      req.flash(
        "success_msg",
        "Poprawnie usunięto ogłoszenie razem ze zdjęciami"
      )
      return res.redirect("/admin/dashboard/all")
    })
    .catch((err) => {
      console.warn(err)
      req.flash("error", err)
      return res.redirect("/admin/dashboard/all")
    })
}

exports.getDashboardSingleEditImage = (req, res) => {
  const { id } = req.params

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      Object.keys(response).forEach((key) => {
        response[key] = "" + response[key]
      })

      console.log(response.images.split(",").length, response.images.split(","))

      return res.render("dashboardSingleEditImage", {
        images: response.images !== "" ? response.images.split(",") : null,
        id,
        isAuthenticated: true,
        title: "CMS - edycja ogłoszenia - zdjęć " + id,
      })
    })
    .catch((err) => {
      console.log(err)
      req.flash("error", "Wystąpił problem : " + err)
      res.redirect("/admin/dashboard")
    })
}

exports.postDashboardSingleEditImageDelete = (req, res) => {
  const { id, imagePathName } = req.query
  console.log(req.query)
  console.log(id, imagePathName)
  if (!imagePathName || !id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Ogloszenie.findByPk(id, { raw: true })
    .then((response) => {
      if (response) {
        const allImages = response.images.split(",")

        const newImages = allImages
          .filter((item) => item !== imagePathName.replace("/", ""))
          .join(",")

        console.log(allImages, newImages)

        Ogloszenie.update(
          { images: newImages },
          { where: { ogloszenieId: id } }
        )
          .then((response) => {
            console.log(response)

            Upload.deleteFiles([{ path: imagePathName.replace("/", "") }])
            req.flash("success_msg", "Zdjęcie poprawnie usunięto")
            return res.redirect("/admin/dashboard/edit/images/" + id)
          })
          .catch((err) => {
            req.flash("error", "Wystapił error :" + err)
            return res.redirect("/admin/dashboard/edit/images/" + id)
          })
      }
    })
    .catch((err) => {
      console.log(err)
      req.flash("error", "Wystąpił problem : " + err)
      res.redirect("/admin/dashboard")
    })
}

exports.postDashboardSingleEditImageAdd = (req, res) => {
  const { id } = req.query

  if (!id) {
    req.flash("error", "Wystąpił problem")
    res.redirect("/admin/dashboard")
  }

  Upload.upload(req, res, async function (err) {
    if (err) {
      console.log(err)
      req.flash("error", err.message)
      return res.redirect("/admin/dashboard/edit/images/" + id)
    } else if (req.files.length == 0) {
      req.flash("error", "Zdjęcia są wymagane")
      return res.redirect("/admin/dashboard/edit/images/" + id)
    }

    let images = req.files.map((item) => item.path).join(",")

    Ogloszenie.findByPk(id, { raw: true })
      .then((response) => {
        if (response) {
          images = images.split(",")
          const allImages = response.images.split(",")
          const newImages = [...images, ...allImages]
            .filter((item) => item)
            .join(",")

          Ogloszenie.update(
            { images: newImages },
            { where: { ogloszenieId: id } }
          )
            .then((response) => {
              console.log(response)
              req.flash("success_msg", "Zdjęcie poprawnie dodano")
              return res.redirect("/admin/dashboard/edit/images/" + id)
            })
            .catch((err) => {
              req.flash("error", "Wystapił error :" + err)
              return res.redirect("/admin/dashboard/edit/images/" + id)
            })
        }
      })
      .catch((err) => {
        console.log(err)
        req.flash("error", "Wystąpił problem : " + err)
        res.redirect("/admin/dashboard")
      })
  })
}
