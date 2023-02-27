/**
 * @typedef {import('sequelize').QueryInterface} QueryInterface
 * @typedef {import('sequelize')} Sequelize
 */

module.exports = {
  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        'user',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
            field: 'id',
            comment: 'ID of the user',
          },
          username: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
            field: 'username',
            comment: 'Username of the user',
          },
          password: {
            type: Sequelize.STRING(128),
            allowNull: false,
            field: 'password',
            comment: 'Password of the user',
          },
          role: {
            type: Sequelize.STRING(16),
            allowNull: false,
            defaultValue: 'user',
            field: 'role',
            comment: 'User role',
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'created_at',
            comment: "Date and time of the user's creation date",
          },
        },
        {
          charset: 'utf8',
          collate: 'utf8_general_ci',
          transaction,
        },
      );
    });
  },

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns {Promise<void>}
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('user', { transaction });
    });
  },
};
