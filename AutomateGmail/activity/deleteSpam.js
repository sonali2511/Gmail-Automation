let puppeteer = require('puppeteer');
let fs = require('fs')

let credentials = process.argv[2];

(async function () {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications"]

        });


        let tabs = await browser.pages();
        let tab = tabs[0];

        let data = await fs.promises.readFile(credentials);
        let { user, pwd, url } = JSON.parse(data);
        let emails = await fs.promises.readFile("metadata.json");
        let id = JSON.parse(emails);

        //console.log("ids",ids);


        await tab.goto("https://stackoverflow.com/users/login", { waitUntil: "networkidle2" })
        let btns = await tab.$$("div[id=openid-buttons]>button")
        btns = btns[0];
        await btns.click();
        await tab.waitForNavigation({ waitUntil: "networkidle0" })

        // await tab.goto("https://accounts.google.com/servicelogin/signinchooser?flowName=GlifWebSignIn&flowEntry=ServiceLogin",{waitUntil:"networkidle2"})

        await tab.type("#identifierId", user, { delay: 100 })
        await tab.keyboard.press("Enter")


        // return 
        await tab.waitForNavigation({ waitUntil: "networkidle0" })
        await tab.waitForSelector("input[name=password]", { timeout: 10000 })
        await tab.type("input[name=password]", pwd, { delay: 30 })

        await tab.evaluate((pwd) => {
            return document.querySelector("input[name=password]").value = ""
        }, pwd)

        await tab.type("input[name=password]", pwd, { delay: 100 })
        await tab.waitForSelector("#passwordNext")
        // let intx = await tab.$$("#passwordNext");
        let i = 0;
        while (i++ < 1000000000) { }
        console.log("wait done")
        await tab.keyboard.press("Enter")

        await tab.waitForNavigation({ waitUntil: "networkidle2" })
        let inboxPage = "https://gmail.com/";

        await tab.goto(inboxPage, { waitUntil: "networkidle2" });

        await tab.waitForSelector(".n6 span[role=button]");
      //  console.log("mila");
        await tab.click(".n6 span[role=button]")

        await tab.waitForSelector(".TN.bzz.aHS-bnv");
        console.log("spam");
        await tab.click(".TN.bzz.aHS-bnv");

        await tab.waitFor(5000);
        // await tab.waitForNavigation({waitUntil:"networkidle0"})

        //  T-Jo J-J5-Ji T-Jo-auq
        //.T-Jo.J-J5-Ji.T-Jo-auq.T-Jo-Jp.T-Jo-JW
        await tab.waitForSelector(".ya span[role=button]");
       // console.log("mil gya")
        await tab.evaluate(() => {
            document.querySelector(".ya span[role=button]").click()
        })

        await tab.waitFor(1000);
        await tab.waitForSelector(".J-at1-auR.J-at1-atl");
        await tab.evaluate(() => {
            document.querySelector(".J-at1-auR.J-at1-atl").click()
        })
      
        console.log("delete");
        

        console.log("done");

      await tab.waitFor(2000);
      await browser.close();
    }
    catch (err) {
        console.log(err);
    }
})();