'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "uiThemes", deps: []
 * addColumn "thumbnail" to table "users"
 * addColumn "uiThemeId" to table "users"
 *
 **/

var info = {
    "revision": 5,
    "name": "add profile settings and themes",
    "created": "2018-06-09T12:42:19.037Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "uiThemes",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING
                },
                "thumbnail": {
                    "type": Sequelize.STRING
                },
                "primary": {
                    "type": Sequelize.STRING
                },
                "secondary": {
                    "type": Sequelize.STRING
                },
                "error": {
                    "type": Sequelize.STRING
                },
                "success": {
                    "type": Sequelize.STRING
                },
                "warning": {
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
                }
            },
            {}
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "thumbnail",
            {
                "type": Sequelize.STRING,
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "uiThemeId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "uiThemes",
                    "key": "id"
                },
                "allowNull": true
            }
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
