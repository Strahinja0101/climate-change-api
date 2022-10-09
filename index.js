const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
//iniz
const app = express()

const articles = []

// source of data for API
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: '' //if address is cut we use a base like a concat
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    }
]

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
        .then(response =>{
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function(){
                const title =  $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/',(req,res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    //site scraping
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    //     .then((response)=>{
    //         const html = response.data
    //         const $ = cheerio.load(html)

    //         $('a:contains("climate")', html).each(function(){
    //             const title = $(this).text()
    //             const url = $(this).attr('href')
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //         })
    //         res.json(articles)
    //     }).catch((err) => console.log(err))

    res.json(articles)
})

app.get('/news/:newspaperId', (req,res) =>{
    // console.log(req)
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    console.log(newspaperAddress);
    axios.get(newspaperAddress)
        .then(response =>{
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })

            res.json(specificArticles)

        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))