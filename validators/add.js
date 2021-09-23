const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateAddInput(data) {
  let errors = {}

  data.tytul = !isEmpty(data.tytul) ? data.tytul.toString() : ""
  data.opis = !isEmpty(data.opis) ? data.opis.toString() : ""
  data.rodzaj = !isEmpty(data.rodzaj) ? data.rodzaj.toString() : ""
  data.typ = !isEmpty(data.typ) ? data.typ.toString() : ""
  data.powierzchnia = !isEmpty(data.powierzchnia)
    ? data.powierzchnia.toString()
    : ""
  data.miasto = !isEmpty(data.miasto) ? data.miasto.toString() : ""
  data.cena = !isEmpty(data.cena) ? data.cena.toString() : ""
  data.liczba_pokoi = !isEmpty(data.liczba_pokoi)
    ? data.liczba_pokoi.toString()
    : ""

  if (Validator.isEmpty(data.tytul)) {
    errors += "<p>Tytuł jest wymagany</p><br/>"
  }

  if (Validator.isEmpty(data.opis)) {
    errors += "<p>Opis jest wymagany</p><br/>"
  }

  if (Validator.isEmpty(data.rodzaj)) {
    errors += "<p>Rodzaj nieruchomości jest wymagany</p><br/>"
  }

  if (Validator.isEmpty(data.typ)) {
    errors += "<p>Typ transakcji jest wymagany</p><br/>"
  }

  if (Validator.isEmpty(data.powierzchnia)) {
    errors += "<p>Powierzchnia jest wymagana</p><br/>"
  }

  if (Validator.isEmpty(data.miasto)) {
    errors += "<p>Miasto jest wymagane</p><br/>"
  }

  if (Validator.isEmpty(data.cena)) {
    errors += "<p>cena jest wymagana</p><br/>"
  }

  if (Validator.isEmpty(data.liczba_pokoi)) {
    errors += "<p>Liczba pokoi jest wymagana</p><br/>"
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
