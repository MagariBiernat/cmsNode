const Validator = require("validator")
const isEmpty = require("is-empty")

module.exports = function validateEmailInput(data) {
  let errors = {}

  data.email = !isEmpty(data.email) ? data.email.toString() : ""
  data.subject = !isEmpty(data.subject) ? data.subject.toString() : ""
  data.content = !isEmpty(data.content) ? data.content.toString() : ""
  data.firstName = !isEmpty(data.firstName) ? data.firstName.toString() : ""
  data.lastName = !isEmpty(data.lastName) ? data.lastName.toString() : ""
  data.phoneNumber = !isEmpty(data.phoneNumber)
    ? data.phoneNumber.toString()
    : ""

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email jest wymagany"
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = "Tytuł jest wymagany"
  }

  if (Validator.isEmpty(data.content)) {
    errors.content = "Treść jest wymagana"
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Imię jest wymagane"
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Nazwisko jest wymagane"
  }
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Numer telefonu jest wymagany"
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
