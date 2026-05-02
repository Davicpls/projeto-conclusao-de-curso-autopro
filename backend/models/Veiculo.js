const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Veiculo = sequelize.define(
  "Veiculo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    marca: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clientes",
        key: "id",
      },
    },
  },
  {
    tableName: "veiculos",
    timestamps: false,
  },
);

module.exports = Veiculo;
