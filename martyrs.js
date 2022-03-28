// https://theatre-martyrs.be/

const { chromium } = require('playwright')

const seasonUrl = 'https://theatre-martyrs.be/saison-2021-22/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theatre = 'Théâtre des Martyrs'
    play.title = await page.evaluate(() => {
        const element = document.querySelector('h1')
        return element ? element.textContent.trim() : ''
    })
    // console.log(play.title)
    play.date = await page.evaluate(() => {
        const element = document.querySelector('#content .container .info_bar.col-12 .row .details')
        return element ? element.textContent.split(' - ')[1] : ''
    })
    play.image = await page.evaluate(() => {
        const element = document.querySelector('#content div.bg_show')
        return element ? element.style.backgroundImage.slice(5,-2) : ''
    })

    play.director = await page.evaluate(() => {
        const element = document.querySelector('#content h1 + p')
        return element ? element.textContent.includes('|') ? element.textContent.split(' | ')[1] : element.textContent : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('#content a[href^="https://shop"]')
        return element ? element.href : ''
    })
    play.summary = await page.evaluate(() => {
        const element = document.querySelector('#content .spectacle_content p:nth-of-type(5)')
        return element ? element.textContent.replace('\nLire plus') : ''
    })
    play.duration = await page.evaluate(() => {
        const element = document.querySelector('#content .container .info_bar.col-12 .row .details')
        return element ? element.textContent.split(' - ')[2].trim() : ''
    })
    play.age = await page.evaluate(() => {
        const element = document.querySelector('.about_show p')
        return element ? element.textContent.trim().slice(-3) === 'ANS' ? element.textContent.slice(-6).trim().toLowerCase() : '' : ''
    })
    play.production = await page.evaluate(() => {
        const element = document.querySelector('h2 + p')
        return element ? element.textContent.trim() : ''
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
        let playCardSelector = document.querySelectorAll('#isotope-list .spectacle.grid-item')
        let playsFromDom = Array.from(playCardSelector)

        return Array.from(playsFromDom).map(item => item.querySelector('a.link_over').href)
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

const martyrs = () => scrapeFrom(seasonUrl)

exports.martyrs = martyrs