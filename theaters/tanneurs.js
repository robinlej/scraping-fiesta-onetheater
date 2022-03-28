// https://www.lestanneurs.be/

const { chromium } = require('playwright')

const seasonUrl = 'https://lestanneurs.be/saisons/saison-2021-2022'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theater = 'Théâtre Les Tanneurs'
    play.title = await page.evaluate(() => document.querySelector('#performance-banner-data-content h2').textContent)
    // console.log(play.title)
    play.date = await page.evaluate(() => document.querySelector('#performance-banner-data-content h3 .performance-banner-data-date').textContent)
    play.image = await page.evaluate(() => document.querySelector('#performance-banner-picture-content img').src)

    play.director = await page.evaluate(() => {
        const element = document.querySelector('#performance-banner-data-content h3 .performance-banner-data-casting')
        return element ? element.textContent : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('#performance-agenda-list table.list td a.buttonlike.standard')
        return element ? element.href : ''
    })
    play.summary = await page.evaluate(() => {
        const element = document.querySelector('.performance-main-summary')
        return element ? element.textContent.trim() : ''
    })
    play.duration = await page.evaluate(() => {
        const element = document.querySelector('#performance-agenda-duration')
        return element ? element.textContent.trim() : ''
    })
    play.age = await page.evaluate(() => {
        const element = document.querySelector('.performance-main-credits p strong')
        return element ? element.textContent.split('Spectacle accessible dès ')[1].split('.')[0] : ''
    })
    play.production = await page.evaluate(() => {
        const element = document.querySelector('.performance-main-credits p:nth-of-type(5)')
        return element ? element.textContent : ''
    })

    return play
}

const scrapeFrom = async (url) => {
    const browser = await chromium.launch({headless: true})
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(url)
    
    let plays = []
    let playsUrl = await page.evaluate(() => {
        let playCardSelector = document.querySelectorAll('.grid-item:not(.past-event)')

        let playsFromDom = Array.from(playCardSelector)

        return Array.from(playsFromDom).map(item => item.querySelector('a.grid-item-hyperlink').href)
    })

    for (let playUrl of playsUrl) {
        let play = await scrapeEachPlay(page, playUrl)
        plays.push(play)
    }

    await page.close()
    await context.close()
    await browser.close()

    return plays
}

const tanneurs = () => scrapeFrom(seasonUrl)

exports.tanneurs = tanneurs