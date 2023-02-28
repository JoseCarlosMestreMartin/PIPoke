const { Router } = require("express");
const express = require("express");
// Importar todos los routers;
const axios = require("axios");
const pokeBigToPokeSmall = require("../functionAux/objPokemonBigToSmall");
const tipoBigToSmall = require("../functionAux/objTipoBigToSmall");
//const Pokemon = require("../models/Pokemon");
// const sequelize = require("sequelize");
// Ejemplo: const authRouter = require('./auth.js');

const { Pokemon, Tipo } = require("../db.js");
const { types } = require("pg");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use(express.json());

//si la dt de types no tiene pokemons, buscarlos de la pokeApi y cargarlos en la DB
let a = async function () {
  let arrayOfTiposB = [];
  /// select all tipos
  try {
    arrayOfTiposB = await Tipo.findAll();
  } catch (error) {
    console.log("error 28: ", error);
  }
  //si no hay tipos cargados buscarlos en la api de pokeapi y cargarlos en la dt
  if (arrayOfTiposB.length === 0) {
    console.log("cargando Types...");
    try {
      let aux = await axios.get(`https://pokeapi.co/api/v2/type`);
      arrayOfTiposB = aux.data.results.map((e) => tipoBigToSmall(e));
      //almacenar en la dt tipos
      await Tipo.bulkCreate(arrayOfTiposB);
      console.log("cargados los types en la db");
    } catch (error) {
      console.log("error 38: ", error);
    }
  }
};
a();
// fin de carga de types de la pokeApi en la db

///"/pokemons/:idPokemon"    LISTO
router.get("/pokemons/:idPokemon", async function (req, res, next) {
  //console.log("req.params: ",req.params);
  const { idPokemon } = req.params;
  // si typeof idPokemon es number buscarlos en la pokeApi, sino buscarlo en la DB
  if (Number.isNaN(Number(idPokemon))) {
    console.log("NO es numero");
    //buscar en la DB
    try {
      let pokemonAux = await Pokemon.findByPk(idPokemon);
      return res.json(pokemonAux);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  } else {
    /// busca en la pokeApi
    try {
      let aux = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${idPokemon}`
      );
      let pokemonMini = pokeBigToPokeSmall(aux.data);
      return res.json(pokemonMini);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    /// fin de busqueda en la pokeApi
  }
});

// "/pokemons" Andando
router.get("/pokemons", async function (req, res, next) {
  const { name } = req.query;

  if (name) {
    //busca name en la DB si no esta busca en la pokeApi
    let pokemonAux;
    try {
      pokemonAux = await Pokemon.findOne({
        where: { name },
      });
      if (pokemonAux) {
        return res.json(pokemonAux);
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (pokemonAux === null) {
      try {
        let aux = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        pokemonAux = pokeBigToPokeSmall(aux.data);
        return res.json(pokemonAux);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  } else {
    /// leer de la BD y agregarle de la pokeAPI
    let arrayPokemonsAux = [];
    try {
      arrayPokemonsAux = await Pokemon.findAll();
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    try {
      let aux = await axios.get(`https://pokeapi.co/api/v2/pokemon`);
      let arrayOfLinks = aux.data.results;
      let arrayOfPromises = arrayOfLinks.map((e) => {
        return axios.get(e.url);
      });
      let arrayOfPokemonBig = await Promise.all(arrayOfPromises);

      let arrayOfPokemonSmall = arrayOfPokemonBig.map((e) => {
        return pokeBigToPokeSmall(e.data);
      });
      arrayPokemonsAux = arrayPokemonsAux.concat(arrayOfPokemonSmall);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    return res.json(arrayPokemonsAux);
  }
});

// post("/pokemons",  Andando
router.post("/pokemons", async function (req, res, next) {
  console.log("req.body: ");
  console.log(req.body);
  const {
    name,
    vida,
    ataque,
    defensa,
    velocidad,
    altura,
    peso,
    imagen,
    imagenEncendida,
    tipos,
  } = req.body;
  if (
    !name ||
    !vida ||
    !ataque ||
    !defensa ||
    !velocidad ||
    !altura ||
    !peso ||
    !imagen ||
    !imagenEncendida
  )
    return res.status(400).json({ message: "falta un valor" });
  try {
    const newPokemon = await Pokemon.create({
      name,
      vida,
      ataque,
      defensa,
      velocidad,
      altura,
      peso,
      imagen,
      imagenEncendida,
      isCreated: true,
    });
    //si types existe vincular los types con la dt de types
    console.log("tipos: ", tipos);
    for (let i = 0; i < tipos.length; i++) {
      try {
        console.log(`tipos[${i}]: `);
        console.log(tipos[i]);

        let name = tipos[i];
        console.log("name: ",name);
        let idTipo = await Tipo.findOne({
            where: { name },
            aqui te quedaste, en encontrar el id
          });
        console.log("idTipo: ",idTipo);

       // newPokemon.addTipo(idTipo);
      } catch (error) {
        console.log("Error: ",error) ;
      }
    }

    return res.json({
      name,
      vida,
      ataque,
      defensa,
      velocidad,
      altura,
      peso,
      imagen,
      imagenEncendida,
      isCreated: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

//get("/types"  Andando
router.get("/types", async function (req, res, next) {
  //Si la dt Types no tiene elementos buscarlos en axios y cargarlos en la dt
  let arrayOfTipos = [];
  /// select all tipos
  try {
    arrayOfTipos = await Tipo.findAll();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  //si no hay tipos cargados buscarlos en la api de pokeapi y cargarlos en la dt
  if (arrayOfTipos.length === 0) {
    try {
      let aux = await axios.get(`https://pokeapi.co/api/v2/type`);
      arrayOfTipos = aux.data.results.map((e) => tipoBigToSmall(e));
      //almacenar en la dt tipos
      await Tipo.bulkCreate(arrayOfTipos);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
  return res.json(arrayOfTipos);
});

module.exports = router;
