const express = require("express");
const cors = require("cors");
const { DataTypes } = require("sequelize");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();
const { sequelize } = require("./models");

const app = express();
const clientesRoutes = require("./routes/clientes");
const itensServicoRoutes = require("./routes/itensServico");
const produtosRoutes = require("./routes/produtos");
const servicosRoutes = require("./routes/servicos");
const usuariosRoutes = require("./routes/usuarios");
const veiculosRoutes = require("./routes/veiculos");

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.json({ message: "API AutoPro rodando" });
});

app.get("/swagger.json", (req, res) => {
  res.json(swaggerDocument);
});

app.use("/clientes", clientesRoutes);
app.use("/veiculos", veiculosRoutes);
app.use("/servicos", servicosRoutes);
app.use("/itens-servico", itensServicoRoutes);
app.use("/produtos", produtosRoutes);
app.use("/usuarios", usuariosRoutes);

const PORT = process.env.PORT || 3001;

async function ensureUsuariosSchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const hasUsuariosTable = tables.some((table) => {
    if (typeof table === "string") {
      return table === "usuarios";
    }

    return table.tableName === "usuarios";
  });

  if (!hasUsuariosTable) {
    return;
  }

  const columns = await queryInterface.describeTable("usuarios");

  if (!columns.senha_hash) {
    await queryInterface.addColumn("usuarios", "senha_hash", {
      type: DataTypes.STRING(255),
      allowNull: true,
    });
  }
}

async function ensureClientesSchema() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  const hasClientesTable = tables.some((table) => {
    if (typeof table === "string") {
      return table === "clientes";
    }

    return table.tableName === "clientes";
  });

  if (!hasClientesTable) {
    return;
  }

  const columns = await queryInterface.describeTable("clientes");

  if (!columns.nome_completo) {
    await queryInterface.addColumn("clientes", "nome_completo", {
      type: DataTypes.STRING(160),
      allowNull: false,
      defaultValue: "Sem nome",
    });
  }

  if (!columns.genero) {
    await queryInterface.addColumn("clientes", "genero", {
      type: DataTypes.ENUM("M", "F", "Outro"),
      allowNull: false,
      defaultValue: "M",
    });
  }

  if (!columns.data_nascimento) {
    await queryInterface.addColumn("clientes", "data_nascimento", {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1900-01-01",
    });
  }

  if (!columns.tipo) {
    await queryInterface.addColumn("clientes", "tipo", {
      type: DataTypes.ENUM("Física", "Jurídica"),
      allowNull: false,
      defaultValue: "Física",
    });
  }

  if (!columns.endereco) {
    await queryInterface.addColumn("clientes", "endereco", {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        logradouro: "Nao informado",
        numero: "S/N",
        bairro: "Nao informado",
        cidade: "Nao informado",
        uf: "NA",
        pais: "Brasil",
        cep: "00000-000",
      },
    });
  }

  if (!columns.is_fornecedor) {
    await queryInterface.addColumn("clientes", "is_fornecedor", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }

  if (!columns.observacao) {
    await queryInterface.addColumn("clientes", "observacao", {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!columns.dataCriacao) {
    await queryInterface.addColumn("clientes", "dataCriacao", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }

  if (!columns.dataAtualizacao) {
    await queryInterface.addColumn("clientes", "dataAtualizacao", {
      type: DataTypes.DATE,
      allowNull: true,
    });
  }

  if (columns.nome) {
    await queryInterface.changeColumn("clientes", "nome", {
      type: DataTypes.STRING(120),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE clientes
      SET nome_completo = nome
      WHERE nome IS NOT NULL
        AND (nome_completo IS NULL OR nome_completo = 'Sem nome')
    `);
  }

  await queryInterface.sequelize.query(`
    UPDATE clientes
    SET "dataCriacao" = COALESCE("dataCriacao", NOW()),
        "dataAtualizacao" = COALESCE("dataAtualizacao", NOW())
  `);
}

async function startDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await ensureUsuariosSchema();
    await ensureClientesSchema();
    console.log("Conexao com PostgreSQL realizada com sucesso");
  } catch (err) {
    console.error("Erro ao conectar com PostgreSQL:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startDB();
