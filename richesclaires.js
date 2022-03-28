const { chromium } = require('playwright')

const seasonUrl = 'https://lesrichesclaires.be/la-saison/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theatre = 'Les Riches-Claires'
    play.title = await page.evaluate(() => document.querySelector('.RC-entry h1').textContent)
    // console.log(play.title)
    play.date = await page.evaluate(() => document.querySelector('.RC-entry .date').textContent)
    play.image = await page.evaluate(() => document.querySelector('.square-box-content img.attachment-thumbnail.wp-post-image').src)

    play.director = await page.evaluate(() => {
        const element = document.querySelector('.RC-entry .RC-meta-line')
        return element ? element.textContent.trim() : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('a[href^="https://shop"]')
        return element ? element.href : ''
    })
    play.summary = await page.evaluate(() => {
        const elements = document.querySelectorAll('.RC-entry .portfolio-content-container p:not(:first-of-type)')
        const summaryText = Array.from(elements).map(p => p.textContent).join('\n')
        return elements ? summaryText.trim() : ''
    })
    play.duration = await page.evaluate(() => {
        // const element = document.querySelector('#performance-agenda-duration')
        // return element ? element.textContent.trim() : ''
        return ''
    })
    play.age = await page.evaluate(() => {
        // const element = document.querySelector('.public h5')
        // return element ? element.textContent.trim() : ''
        return ''
    })
    play.production = await page.evaluate(() => {
        const element = document.querySelector('.cast')
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
        let playCardSelector = document.querySelectorAll('article:not(:first-of-type)')

        let playsFromDom = Array.from(playCardSelector)
        playsFromDom.shift()

        return Array.from(playsFromDom).map(item => item.querySelector('.custom-portfolio-container a').href)
    })

    for (let playUrl of playsUrl) {
        let play = await scrapeEachPlay(page, playUrl)
        plays.push(play)
    }

    await page.close()
    await context.close()
    await browser.close()

    // console.log(plays)
    return plays
}

// scrapeFrom(seasonUrl)
const richesclaires = () => scrapeFrom(seasonUrl)
exports.richesclaires = richesclaires