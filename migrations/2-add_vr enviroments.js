'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "vrEnviroments", deps: [books]
 *
 **/

var info = {
    "revision": 2,
    "name": "add vr enviroments",
    "created": "2018-05-30T20:54:15.207Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "vrEnviroments",
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
            "thumbnail": {
                "type": Sequelize.STRING
            },
            "enviromentDefinition": {
                "type": Sequelize.JSON
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
        },
        {}
    ]
}];

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
