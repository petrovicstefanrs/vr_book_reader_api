'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "bookId" to table "vrEnviroments"
 *
 **/

var info = {
    "revision": 3,
    "name": "add vr enviroments2",
    "created": "2018-05-30T20:57:56.487Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "vrEnviroments",
        "bookId",
        {
            "type": Sequelize.INTEGER,
            "onUpdate": "CASCADE",
            "onDelete": "SET NULL",
            "references": {
                "model": "books",
                "key": "id"
            },
            "allowNull": true
        }
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
