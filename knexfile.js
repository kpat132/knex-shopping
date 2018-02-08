// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host:'localhost',
      user:'knex_user',
      password : 'password',
      database : 'knex_shopping',
      charset: 'utf8',
    },
    
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/knex/migrations'
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    },
    //debug:true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
