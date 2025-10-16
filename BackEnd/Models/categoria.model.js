module.exports = (sequelize, Sequelize) => {
    const Categoria = sequelize.define("Categoria", {
        idCategoria: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        Nombre: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'categorias'
    });

    return Categoria;
};