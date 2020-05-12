const chalk=require("chalk");
const figlet=require("figlet");
var help=()=>{
    console.log(`${chalk.redBright(figlet.textSync("Commnands"))}

    ${chalk.magenta("<options>")}
    ${chalk.green("To compose Mails Run the following command:")}
    node "composeMail.js" "credentials.json"

    ${chalk.blueBright("To get Pdf of important Mails Run the following command:")}
    node "impMsgToPdf.js" "credentials.json"

    ${chalk.yellow("To delete all spam mails Run the following command:")}
    node "deleteSpam.js" "credentials.json"
    `);
};
help();