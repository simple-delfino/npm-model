const inquirer = require("inquirer");
const program = require("commander");
const chalk = require("chalk");
const download = require("download-git-repo");
const ora = require("ora");
const spinner = ora("Downloading please wait......");
const fs = require("fs-extra");
const symbols = require("log-symbols");
const validateProjectName = require("validate-npm-package-name");
const tempUrl = {
    service: "https://github.com/simple-delfino/es6-doc.git",
    ui: "https://github.com/simple-delfino/vue-cli-doc.git",
};
exports.initPlugin = function (name) {
    const result = validateProjectName(name);
    if (!result.validForNewPackages) {
        console.error(
            symbols.error,
            chalk.red(`Invalid plugin name: "${name}"`)
        );
        result.errors &&
            result.errors.forEach((err) => {
                console.error(chalk.red.dim("Error: " + err));
            });
        result.warnings &&
            result.warnings.forEach((warn) => {
                console.error(chalk.red.dim("Warning: " + warn));
            });
        process.exit(1);
    }
    if (!fs.existsSync(name)) {
        inquirerHandle(name);
    } else {
        console.error(symbols.error,chalk.)
    }
};

const inquirerHandle = (name) => {
    questionList[0].default = name;
    questionList[1].default = name; 
    inquirer.prompt(questionList).then((answer) => {
        spinner.start();
        console.log(tempUrl[answer.type])
        download(
            `direct:${tempUrl[answer.type]}`,
            answer.name,
            { clone: true },
            (err) => {
                if (err) {
                    spinner.fail();
                    console.log(symbols.error, chalk.red(err));
                } else {
                    spinner.succeed();
                    const fileName = `${answer.name}/package.json`;
                    const meta = {
                        name: answer.name,
                        description: answer.description,
                        author: answer.author,
                    };
                    if (fs.existsSync(fileName)) {
                        const content = fs.readFileSync(fileName).toString();
                        const result = handlebars.compile(content)(meta);
                        fs.writeFileSync(fileName, result);
                    }
                    console.log(symbols.success, chalk.green("项目初始化完成"));
                }
            }
        );
    });
};

const questionList = [
    {
        type: "input",
        name: "name",
        message: "请输入插件名称:",
        default: '',
        filter(val) {
            return val.trim();
        },
        // 验证数据
        validate(val) {
            const validate = val.trim().split(" ").length === 1;
            return validate || "插件名称不允许有空格";
        },
        transformer(val) {
            return val;
        },
    },
    {
        type: "input",
        name: "description",
        message: "请提供插件描述:",
        default: '',
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        },
    },
    {
        type: "input",
        name: "author",
        message: "请提供作者信息:",
        default: "delfino",
        validate(val) {
            return true;
        },
        transformer(val) {
            return val;
        },
    },
    {
        type: "list",
        name: "type",
        message: "请选择组件类型:",
        choices: Object.keys(tempUrl),
        default: "service",
        // 使用filter将回答变成小写
        filter: function (val) {
            return val.toLowerCase();
        },
    },
];
