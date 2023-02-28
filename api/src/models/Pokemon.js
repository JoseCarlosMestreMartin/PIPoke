const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    vida:{
      type: DataTypes.INTEGER
    },
    ataque:{
      type: DataTypes.INTEGER
    },
    defensa:{
      type: DataTypes.INTEGER
    },
    velocidad:{
      type: DataTypes.INTEGER
    },
    altura:{
      type: DataTypes.INTEGER
    },
    peso:{
      type: DataTypes.INTEGER
    },
    imagen:{
      type: DataTypes.STRING
    },
    imagenEncendida:{
      type: DataTypes.STRING
    },
    isCreated:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }

  },{
    timestamps: false,
  }
  );
};
