const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { render } = require('ejs');
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://nathangabrielfleite:nathanpao123@cluster0.8t5dwbn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true });

var app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(80, () => {
  console.log('server started');
});

app.get('/', (req, res) => {
  res.redirect("home.html")
});

app.post("/cadastrar_reserva", function(req, resp) {

    // realiza conexão com banco de dados
    client.connect((err) => {
      // salva dados no banco
      client.db("Cluster0").collection("reservas").insertOne(
        { db_nome: req.body.nome, db_tipo_quarto: req.body.tipo_quarto, db_data_chegada: req.body.data_chegada, db_data_saida: req.body.data_saida}, function (err) {
        if (err) {
          resp.render('resposta', {resposta: "Erro ao cadastrar reserva"})
        }else {
          resp.render('resposta', {resposta: "Reserva realizada com sucesso!"})        
        };
      });
    });
  
});

app.get("/listar_reservas", function(req, resp) {

    client.connect((err) => {
      // busca todos os usuarios no banco de dados
      client
        .db("Cluster0")
        .collection("reservas")
        .find().toArray(function(err, items) {
          // renderiza a resposta para o navegador
          resp.render("lista_reservas", { reservas: items });
        });
    });  
  
  });