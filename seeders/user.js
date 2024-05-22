const bcrypt = require('bcrypt');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('Users', [{
        id: 1,
        username: 'admin',
        password: await bcrypt.hash('admin',10),
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@gmail.com',
        no_hp: '+62 831-9120-2797',
        alamat: 'Secret',
        create_at: new Date(),
        update_at: new Date(),
      },
      {
        id: 2,
        username: 'Radiatul Muthmainnah',
        password: await bcrypt.hash('dea',10),
        first_name: 'Radiatul',
        last_name: 'Muthmainnah',
        email: 'radiatul2005@gmail.com',
        no_hp: '+62 831-9120-2797',
        alamat: 'Bukittinggi',
        create_at: new Date(),
        update_at: new Date(),
       }
   
   
   ],{});
     
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};