const { chromium } = require('playwright')

const seasonUrl = 'https://varia.be/category/agenda/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theatre = 'Théâtre Varia'
    play.title = await page.evaluate(() => document.querySelector('.cover-slide-infos h1').textContent)
    // console.log(play.title)
    play.date = await page.evaluate(() => document.querySelector('.cover-slide-infos h3').textContent.slice(3))
    play.image = await page.evaluate(() => document.querySelector('#cover img.cover-image').src)

    play.director = await page.evaluate(() => {
        const element = document.querySelector('.cover-slide-infos .intro h4')
        return element ? element.textContent.trim() : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('.book-links a.acheter')
        return element ? element.href : ''
    })
    play.summary = await page.evaluate(() => {
        const container = document.querySelector('.entry-content')
        const summaryTitle = container.querySelector('h2')
        const summaryP = container.querySelectorAll('h2 ~ p')
        let partOfSummary = true
        const summaryPContent = Array.from(summaryP).map(p => {
            if (p.textContent.search(/^\s$/) >= 0) partOfSummary = false
            if (partOfSummary) return p.textContent.trim()
        })
        const summaryText = summaryTitle.textContent.trim() + '\n' + summaryPContent.join('\n')
        return summaryText.trim()
    })
    play.duration = await page.evaluate(() => {
        // const element = document.querySelector('#performance-agenda-duration')
        // return element ? element.textContent.trim() : ''
        return ''
    })
    play.age = await page.evaluate(() => {
        const element = document.querySelector('.public h5')
        return element ? element.textContent.trim() : ''
    })
    play.production = await page.evaluate(() => {
        const element = document.querySelector('#credits p:first-of-type')
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
        let playCardSelector = document.querySelectorAll('#agenda-content #Container .mix:not([data-hide="is-hidden"])')

        let playsFromDom = Array.from(playCardSelector)

        return Array.from(playsFromDom).map(item => item.querySelector('a.post-link').href)
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
const varia = () => scrapeFrom(seasonUrl)
exports.varia = varia