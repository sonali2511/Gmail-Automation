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
       
    
       

        await tab.goto("https://stackoverflow.com/users/login", { waitUntil: "networkidle2" })
        let btns = await tab.$$("div[id=openid-buttons]>button")
        btns = btns[0];
        await btns.click();
        await tab.waitForNavigation({ waitUntil: "networkidle0" })

   

        await tab.type("#identifierId", user, { delay: 100 })
        await tab.keyboard.press("Enter")


        // return 
        await tab.waitForNavigation({ waitUntil: "networkidle0" })
        await tab.waitForSelector("input[name=password]", { timeout: 10000 })
        await tab.type("input[name=password]", pwd, { delay: 30 })

        await tab.evaluate((pwd) => {
            return document.querySelector("input[name=password]").value = ""
        },pwd)

        await tab.type("input[name=password]", pwd, { delay: 1000 })
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
           

           await tab.waitFor(2500);

           await tab.waitForSelector(".n6 span[role=button]");
          
           await tab.click(".n6 span[role=button]")

           await tab.waitFor(1500);

        await tab.waitForSelector(".TN.bzz.aHS-bnv");
        console.log("spam");
        await tab.click(".TN.bzz.aHS-bnv");

        await tab.waitFor(2000);
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

        await tab.waitFor(2500);
        //   await tab.waitForNavigation({ waitUntil: "networkidle2" })
    
        // await tab.waitForSelector("T-Jo J-J5-Ji T-Jo-auq T-Jo-iAfbIe")   //delete btn
           await tab.waitForSelector(".TN.bzz.aHS-bns");
          
           await tab.click(".TN.bzz.aHS-bns")
           console.log("imp btn");
    
           await tab.waitFor(1500);
          // await tab.waitForNavigation({ waitUntil: "networkidle2" })
    
           await tab.waitForSelector("div[role='main'] table[role='grid'] tr[role='row']");
           let impPosts  = await tab.$$("div[role='main'] table[role='grid'] tr[role='row']")
        //   console.log(impPosts.length);
    
           let importantMessages=[];
            let idx=0;
            while(idx<impPosts.length){
                await tab.evaluate((el) => {
                    return el.click()
                    }, impPosts[idx]);
                    await tab.waitFor(1000);
    
                    await tab.waitForSelector(".hP");
                   
                let title=await tab.evaluate(() => {
                        let heading=document.querySelector('.hP').innerHTML;
                        return heading;
                     })
               //      console.log(title);
                     await tab.waitFor(1000);
                     
                await tab.waitForSelector(".gD");
                let from=await tab.evaluate(() => {
                    let msgFrom=document.querySelector('.gD').innerHTML;
                    return msgFrom;
                 })
            //     console.log(from);
                 await tab.waitFor(1000);
                
                  let obj={
                      "heading":title,
                    "messageFrom":from
                  }
    
                  importantMessages.push(obj);
    
                  await tab.waitFor(1000);
    
                await tab.waitForSelector(".ar6.T-I-J3.J-J5-Ji");
                console.log("back");
                await tab.click(".ar6.T-I-J3.J-J5-Ji");
    
                await tab.waitFor(1500);
                    idx++;
            }
             console.log(importantMessages);
        let str="";
             for(d of importantMessages){
                str+='<li style="padding:3px 2px;"><b><span style="color:goldenrod;">'+d.heading+": </span></b><span>"+d.messageFrom+"</span></li>";
              
            }
            str+="</ol>";
       
           await browser.close();
    
           browser = await puppeteer.launch({
            headless: true,
            // defaultViewport: null,
            args: ["--start-maximized", "--disable-notifications", "--incognito"]  // "--incognito",
        })
    
        tabs = await browser.pages();
        tab = tabs[0];
    
       // console.log(str)
        await tab.setContent(str);
        await tab.pdf({path: 'result.pdf', format: 'A4'});
          
        await tab.waitFor(3000);
        await browser.close();
    }
    catch(err){
        console.log(err);
    }
})();