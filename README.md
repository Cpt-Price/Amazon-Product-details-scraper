# Amazon-Product-details-scraper
A simple project showcasing web scraping and automation using puppeteer. 

Automatically navigates to the search results and scrapes product details from the results and saves them as .JSON and .CSV file. A recording of a sample output run is available in the ``sample run`` folder.

## Command
 
  * Open the terminal and run the following command:

  ```node
  node price "search.json"
  ```
  
## Features

* Searches for the product, automatically navigates between the results.
  
* Scrapes the name, manufacturer, pricing, rating and number of reviews.
  
* Saves the data in a .JSON and .CSV file.

* Logs messages to console for progress monitoring.

* Output files are saved to the``output`` folder
  
  
## Use

* Clone the repository.

* Open the base directory of the repository.

* Run the following commands in terminal to install the required modules:

  ```node
  npm install puppeteer
  ```
  ```node
  npm install json2csv
  ```

* Edit the search.JSON file to change the product to search for:
  
  ```json
    {
    "addr" : "https://www.amazon.in",
    "product" : "galaxy m31 cover"
  }
  ```
