let puppeteer = require('puppeteer');
let fs = require('fs')

let credentials = process.argv[2];

(async function(){
    try{
        let browser=await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized","--disable-notifications"]

        });


        let tabs = await browser.pages();
        let tab = tabs[0];

        let data = await fs.promises.readFile(credentials);
        let { user, pwd, url } = JSON.parse(data);
        let emails = await fs.promises.readFile("metadata.json");
       let id=JSON.parse(emails);
       
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
        },pwd)

        await tab.type("input[name=password]", pwd, { delay: 100 })
        await tab.waitForSelector("#passwordNext")
        // let intx = await tab.$$("#passwordNext");
        let i = 0;
        while (i++ < 1000000000) { }
        console.log("wait done")
        await tab.keyboard.press("Enter")

        await tab.waitForNavigation({ waitUntil: "networkidle2" })
        let inboxPage="https://gmail.com/";
       await tab.goto(inboxPage,{waitUntil:"networkidle2"});

       await tab.waitForSelector(".T-I.J-J5-Ji.T-I-KE.L3")
       console.log("compose")
       await tab.click(".T-I.J-J5-Ji.T-I-KE.L3");

     //  await tab.waitForNavigation({ waitUntil: "networkidle2" })

       
       console.log(id);
       for(let key in id)
           {
            await tab.waitForSelector(".aoD.hl");
            await tab.type(".aoD.hl", id[key], { delay: 100 })
            await tab.keyboard.press("Enter")
           }
      
           let subject="Automated mail";
           await tab.waitForSelector("input[name=subjectbox]");
           console.log("subject")
           await tab.type("input[name=subjectbox]",subject,{delay:100});

           let text="This mail is sent through automating Gmail account!!";
           await tab.waitForSelector(".Am.Al.editable.LW-avf.tS-tW");
           console.log(text);
           await tab.type(".Am.Al.editable.LW-avf.tS-tW",text,{delay:100});

           await tab.waitForSelector(".gU.Up");
           console.log("send");
           await tab.click(".gU.Up");
          

        
           await tab.waitFor(5000);
           await browser.close();
      
    }
    catch(err){
        console.log(err);
    }
})();