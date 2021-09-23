module.exports = (sequelize, Sequelize) => {
  const Ogloszenie = sequelize.define("ogloszenia", {
    ogloszenieId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tytul: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    opis: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    rodzaj: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        isIn: [["działka", "mieszkanie", "lokal", "dom"]],
      },
    },
    typ: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        isIn: [["sprzedaż", "wynajem"]],
      },
    },
    powierzchnia: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    miasto: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    powiat: {
      type: Sequelize.TEXT,
    },
    gmina: {
      type: Sequelize.TEXT,
    },
    ulica: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    wojewodztwo: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        isIn: [
          [
            "dolnośląskie",
            "kujawsko-pomorskie",
            "lubelskie",
            "lubuskie",
            "łódzkie",
            "małopolskie",
            "mazowieckie",
            "opolskie",
            "podkarpackie",
            "podlaskie",
            "pomorskie",
            "śląskie",
            "świętokrzyskie",
            "warmińsko-mazurskie",
            "wielkopolskie",
            "zachodniopomorskie",
          ],
        ],
      },
    },
    cena: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    images: {
      type: Sequelize.TEXT,
    },
    liczba_pokoi: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        isInt: true,
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  })

  return Ogloszenie
}
