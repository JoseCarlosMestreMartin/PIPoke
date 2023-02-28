
module.exports = (pokemonCompleto) =>{
    ////// limpieza de datos
    let pokemonAux = {};
    let arrayOfStats = pokemonCompleto.stats;
    ////__name
    pokemonAux.name = pokemonCompleto.name;
    ////__vida
    pokemonAux.vida = arrayOfStats.find(e=>e.stat.name === 'hp').base_stat;
    ////__ataque
    pokemonAux.ataque = arrayOfStats.find(e=>e.stat.name === 'attack').base_stat;
    ////__defensa
    pokemonAux.defensa = arrayOfStats.find(e=>e.stat.name === 'defense').base_stat;
    ////__velocidad
    pokemonAux.velocidad = arrayOfStats.find(e=>e.stat.name === 'speed').base_stat;
    ////__altura height
    pokemonAux.altura = pokemonCompleto.height;
    ////__peso  weight
    pokemonAux.peso = pokemonCompleto.weight;
    ////__imagen
    pokemonAux.imagen = pokemonCompleto.sprites.other['official-artwork'].front_default;
    ////__imagenEncendida
    pokemonAux.imagenEncendida = pokemonCompleto.sprites.other['official-artwork'].front_shiny;
    ////__idOriginal
    pokemonAux.idOriginal = pokemonCompleto.id;
    ///__types
    pokemonAux.types = pokemonCompleto.types.map((e)=>{return e.type.name});
    ///// fin limpieza de datos

return pokemonAux;
};
    
    