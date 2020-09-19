#!/usr/bin/env node

process.env.NODE_PATH = __dirname + "/../node_modules";
const { resolve } = require("path");
const program = require("commander");
const pkg = require("../package.json");
const initPlugin = require("../lib/init").initPlugin;

program.version(pkg.version, "-v,--version");

program.usage("<command>");

program
    .command("init <name>")
    .description("Generate a new project")
    .alias("i")
    .action((name) => {
        initPlugin(name);
    });

program.parse(process.argv);
