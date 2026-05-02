const express = require("express");
const { Cliente, Veiculo } = require("../models");
const { isIntegerGreaterThanZero, isValidEmail } = require("../utils/utils");

const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const clientes = await Cliente.findAll();

    return res.json(clientes);
  } catch (error){
    return res.status(500).json({
      message: "Erro interno ao buscar cliente"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const idValido = isIntegerGreaterThanZero(id);

    if (!idValido) {
      return res.status(400).json({
        message: "ID deve ser um número inteiro maior que zero"
      });
    }

    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }
    
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno ao buscar cliente"
    });
  }
});

router.post("/", async (req, res) => {
  try {

    const { nome, email, telefone } = req.body;

    if (!isValidEmail(email)){
      return res.status(400).json({
        message: "Insira um email válido"
      });
    }

    const cliente = await Cliente.create({
      nome,
      email,
      telefone
    });

    return res.status(201).json(cliente);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Erro de validação",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Registro duplicado",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    return res.status(500).json({
      message: "Erro interno ao cadastrar cliente"
    });
  }
});

router.put("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const idValido = isIntegerGreaterThanZero(id);

    if (!idValido) {
      return res.status(400).json({
        message: "ID deve ser um número inteiro maior que zero"
      });
    }

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const { nome, email, telefone } = req.body;

    const clienteAtualizado = await cliente.update({
      nome,
      email,
      telefone
    });

    res.json(clienteAtualizado);
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Erro de validação",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "E-mail já cadastrado para outro cliente",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    return res.status(500).json({
      message: "Erro interno ao cadastrar cliente"
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const idValido = isIntegerGreaterThanZero(id);

    if (!idValido) {
      return res.status(400).json({
        message: "ID deve ser um número inteiro maior que zero"
      });
    }

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    await cliente.destroy();

    return res.status(200).json({ message: "Cliente deletado com sucesso" });
  } catch (error){
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Erro de validação",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "E-mail já cadastrado para outro cliente",
        errors: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    return res.status(500).json({
      message: "Erro interno ao cadastrar cliente"
    });
  }
});

module.exports = router;
