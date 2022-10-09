const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
//iniz
const app = express()

const articles = []

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change'
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/environment/climate-change'
    }
]

app.get('/',(req,res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    //site scraping
    axios.get('https://www.theguardian.com/environment/climate-crisis')
        .then((response)=>{
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url
                })
            })
            res.json(articles)
        }).catch((err) => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))