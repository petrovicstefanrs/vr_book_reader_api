'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "users", deps: []
 * createTable "books", deps: [users]
 * createTable "bookContents", deps: [books]
 *
 **/

var info = {
    "revision": 1,
    "name": "init_migration",
    "created": "2018-05-13T14:31:00.583Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "username": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "email": {
                    "type": Sequelize.STRING,
                    "validate": {
                        "isEmail": true
                    }
                },
                "firstname": {
                    "type": Sequelize.STRING,
                    "notEmpty": true
                },
                "lastname": {
                    "type": Sequelize.STRING,
                    "notEmpty": true
                },
                "password": {
                    "type": Sequelize.STRING,
                    "allowNull": false
                },
                "status": {
                    "type": Sequelize.ENUM('active', 'inactive'),
                    "defaultValue": "active"
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "books",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "description": {
                    "type": Sequelize.TEXT
                },
                "directory": {
                    "type": Sequelize.STRING
                },
                "isFavourite": {
                    "type": Sequelize.BOOLEAN
                },
                "thumbnail": {
                    "type": Sequelize.STRING
                },
                "createdAt": {
                    "type": Sequelize.DATE
                },
                "deletedAt": {
                    "type": Sequelize.DATE
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "userId": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "bookContents",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "path": {
                    "type": Sequelize.STRING
                },
                "pageIndex": {
                    "type": Sequelize.INTEGER
                },
                "extension": {
                    "type": Sequelize.STRING,
                    "allowNull": true
                },
                "deletedAt": {
                    "type": Sequelize.DATE
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "allowNull": false
                },
                "bookId": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "books",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
