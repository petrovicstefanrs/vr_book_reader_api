'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "bookId" from table "vrEnviroments"
 * addColumn "vrEnviromentId" to table "books"
 *
 **/

var info = {
    "revision": 4,
    "name": "add vr enviroments3",
    "created": "2018-05-30T21:00:49.312Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["vrEnviroments", "bookId"]
    },
    {
        fn: "addColumn",
        params: [
            "books",
            "vrEnviromentId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "vrEnviroments",
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
