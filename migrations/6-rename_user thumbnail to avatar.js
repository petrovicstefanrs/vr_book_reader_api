'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "thumbnail" from table "users"
 * addColumn "avatar" to table "users"
 *
 **/

var info = {
    "revision": 6,
    "name": "rename user thumbnail to avatar",
    "created": "2018-06-09T14:02:23.928Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["users", "thumbnail"]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "avatar",
            {
                "type": Sequelize.STRING,
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
