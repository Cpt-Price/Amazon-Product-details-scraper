let fs = require("fs");
let pupp = require("puppeteer");
const { parse } = require('json2csv');

// load the file
let infoFile = process.argv[2];  

(async function(){

    let data = await fs.promises.readFile(infoFile, "utf-8");
    let info = JSON.parse(data);
    addr = info.addr;
    product = info.product;

    // launch the browser
    let browser = await pupp.launch({
        headless : false,
        defaultViewport : null,
        args : ["--start-maximized", "--disable-notifications"],
    
    })

    let noPages = await browser.pages();
    let tab = noPages[0];

    await tab.goto(addr, {waitUntil : "networkidle2"});

    // wait for the search bar and then type
    await tab.waitForSelector("#twotabsearchtextbox");
    await tab.type("#twotabsearchtextbox", product);
   
    // click on search button
    await Promise.all([
        await tab.click("#nav-search-submit-text"),
        tab.waitForNavigation({
          waitUntil: "networkidle2",
          delay: 400,
          timeout: 60000,
        }),
      ])
 
      // save the current search results url for navigation
      let search_res = await tab.evaluate(() => location.href);
      console.log("nav - " + search_res);

     // thi is an array used to store the scraped information/details 
    let products = [];
    

    // Iterate over first five elements
    // Starting from zero might cause issues due to ADs not having an asin / unique product number
    for(let n =0; n < 5; n++){

     await tab.waitForSelector(`[data-cel-widget=search_result_${n}]`); // nth result wait 
     let prod = await tab.$(`[data-cel-widget=search_result_${n}]`);    // nth result selection 

     // get nth result's asin
     let text = await tab.evaluate((prod) => prod.getAttribute("data-asin"), prod); 

    // console.log(text); 

    // goto the product using asin
      let prod_url = `https://amazon.in/dp/${text}`; 
      await tab.goto(prod_url, {waitUntil : "networkidle2"});
  

     //getting each item's details
     let details = await tab.evaluate(()=>{

        // scrap the required info using querySelector 
        let title = document.querySelector('#productTitle').innerText;
        let manufacturer = document.querySelector('#bylineInfo').innerText;
        let price = document.querySelector('#priceblock_saleprice, #priceblock_ourprice').innerText;
        let rating = document.querySelector('#acrPopover').getAttribute('title'); 
        let review_nos = document.querySelector('#acrCustomerReviewText').innerText;
        
       // return the info
        return{
            title,
            manufacturer,
            price,
            rating,
            review_nos,
        }
     })
     
     // push the details into the products array
     products.push(details);

     // print a message to console for confirmation
     console.log(`visited product ${n+1}, data pushed, asin - ${text}`);

     // navigate back to results
    await tab.goto(search_res, {waitUntil : "networkidle2"}); 
    }

    // save the data as a .JSON file
    fs.writeFileSync('./output/data_json.json', JSON.stringify(products), 'utf-8');
    console.log("Data written to .JSON file");

    // for saving the data as .CSV we need the field titles
    let fields = ['title', 'manufacturer', 'price', 'rating', 'review_nos'];

    // using the json2csv parser convert the data to a CSV
    const csv = parse(products, fields);
    
    // write the data to a data_csv.CSV file
    fs.writeFileSync('./output/data_csv.csv', csv, 'utf-8'); 
    console.log("Data written to a .CSV file");
    
})();

