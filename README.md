# webscraper-bot

Discord web scraping bot used to scrape websites with dynamic content and send notifications when there is a new item.

> 📣 There's a new version of this bot, find more about it here: https://discord.gg/9PU7GAUfBV

## Instructions

#### 1.Adding bot to your server

This version development has been paused but you can try out [the new version](https://discord.gg/9PU7GAUfBV) or self host it (e.g. using Render or Railway),

#### 2.Adding new scraper job

Use `/create-job` command and fill in the form:

- __name__ - name of the job 
- __url__ - url that the bot will scrape
- __selector__ - selector for an `a` tag with link to element _(examples below)_
- __interval__ - interval of the job in minutes _(min 1 minute)_
- __active?__ - default `true`, if the job should be active right away _(you can always enable/disable job with `[enable/disable]-job` commands)_
- __channel?__ - defualt `channel where the command was run` which channel should be messaged when the new item appear
- __clean?__ - default `true`, if the query params should be ignored _(essential for some sites like Ebay)_
 
![image](https://user-images.githubusercontent.com/51968772/189994388-cae5cddb-ac35-4c96-a6ae-05dd0f976e4a.png)

After that you can do basic CRUD opeartions on jobs with commands like `/list-jobs` `/update-job` `/delete-job`...

#### 3.Waiting...

After that you simply wait for the job run and it will send message when new items are found:

![image](https://user-images.githubusercontent.com/51968772/189994991-afbf8554-fc1a-4a6c-a85b-a62a1c7e47f5.png)


>You can also run the job manually with `/run-job`. Note that the first run will get all the elements that will be on the webiste.
![image](https://user-images.githubusercontent.com/51968772/189994697-cf21f444-5a46-4cdb-bbff-8468759ff15a.png)


## How to get selector

The selector is a `querySelectorAll` string that the bot uses to get unique `a` tags linking to items you want to scrape. 
To verify if your selector is working you can run `document.querySelectorAll(<your selector>)` in browser console and check if the function returns items you want to scrape.

### Examples of selectors

- Ebay: `.srp-river-results .s-item__image a`
- Otodom: `[data-cy=listing-item-link]`
- Olx: `[data-cy=l-card] > a`

## Feel free to contribute, there are a lot of things to improve :)
