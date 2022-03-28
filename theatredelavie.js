const { chromium } = require('playwright')

const seasonUrl = 'https://www.theatredelavie.be/saison-actuelle/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theatre = 'Théâtre de la Vie'
    play.title = await page.evaluate(() => document.querySelector('h1').textContent)
    // console.log(play.title)
    play.date = await page.evaluate(() => {
        const elements = document.querySelector('[data-id="7a8dee8"] > div > div').children
        let text = elements[0].textContent.trim() + ' ' + elements[1].textContent.trim()
        text = text.includes('septembre') || text.includes('octobre') || text.includes('novembre') || text.includes('décembre') ? text + ' 2021' : text + ' 2022'
        return text
    })
    
    play.image = await page.evaluate(() => {
        return document.querySelector('#elementor-frontend-inline-css').textContent.split('background-image:')[document.querySelector('#elementor-frontend-inline-css').textContent.split('background-image:').length - 1].slice(5,-5)
        // const element = document.querySelector('.elementor-172 .elementor-element.elementor-element-54e3303:not(.elementor-motion-effects-element-type-background)')
        // return element ? element.style.backgroundImage.slice(5,-2) : ''
    })

    play.director = await page.evaluate(() => {
        const element = document.querySelector('.elementor-element.elementor-element-ba765ee')
        return element ? element.textContent.trim() : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('.btn-ticket')
        return element ? element.href : ''
    })
    play.summary = await page.evaluate(() => {
        const element = document.querySelector('.elementor-text-editor.elementor-clearfix')
        return element ? element.textContent.trim() : ''
    })
    play.duration = await page.evaluate(() => {
        // const element = document.querySelector('#performance-agenda-duration')
        // return element ? element.textContent.trim() : ''
        return ''
    })
    play.age = await page.evaluate(() => {
        // const element = document.querySelector('.performance-main-credits p strong')
        // return element ? element.textContent.split('Spectacle accessible dès ')[1].split('.')[0] : ''
        return ''
    })
    play.production = await page.evaluate(() => {
        const element = document.querySelector('.elementor-element-0d029b8')
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
        let playCardSelector = document.querySelectorAll('.archives-spectacles.saison-en-cours .archives-spectacle:not(.archives-edito):not(:nth-of-type(2))')

        let playsFromDom = Array.from(playCardSelector)

        return Array.from(playsFromDom).map(item => item.querySelector('a').href)
    })

    for (let playUrl of playsUrl) {
        let play = await scrapeEachPlay(page, playUrl)
        plays.push(play)
    }

    await page.close()
    await context.close()
    await browser.close()

    return plays
    // console.log(plays)
}

const theatredelavie = () => scrapeFrom(seasonUrl)
// scrapeFrom(seasonUrl)

exports.theatredelavie = theatredelavie