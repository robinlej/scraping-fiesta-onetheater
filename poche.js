const { chromium } = require('playwright')

const pocheUrl = 'https://poche.be/shows'

const scrapePochePlays = async (page, url) => {
    await page.goto(url)

    let play = {}
            
    play.theatre = 'Théâtre de Poche'
    play.title = await page.evaluate(() => document.querySelector('.showMainInfos .content h1').textContent)
    play.image = await page.evaluate(() => document.querySelector('.showMainInfos .affiche img').src)
    directorAndDate = await page.evaluate(() => document.querySelector('.showMainInfos .content h4').textContent.split(' | '))
    play.director = await directorAndDate[0].split('de ')[1]
    play.date = await directorAndDate[1]

    play.bookingUrl = await page.evaluate(() => 
        document.querySelector('.sect-topBannerDetail .showMainInfos .content .table .cell a.btn') ? document.querySelector('.sect-topBannerDetail .showMainInfos .content .table .cell a.btn').href : ''
    )
    play.summary = await page.evaluate(() => 
        document.querySelector('#sect-resume .fromWYSIWYG') ? document.querySelector('#sect-resume .fromWYSIWYG').textContent.trim() : ''
    )
    play.duration = await page.evaluate(() => 
        document.querySelector('#sect-resume .practical .time') ? document.querySelector('#sect-resume .practical .time').textContent : ''
    )
    play.age = await page.evaluate(() => 
        document.querySelector('#sect-resume .practical .age') ? document.querySelector('#sect-resume .practical .age').textContent : ''
    )
    play.production = await page.evaluate(() =>
        document.querySelector('#sect-production .content.fromWYSIWYG p') ? document.querySelector('#sect-production .content.fromWYSIWYG p').textContent : ''
    )

    return play
}

const scrapeFrom = async (url) => {
    const browser = await chromium.launch({headless: true})
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(url)
    
    let plays = []
    let playsUrl = await page.evaluate(() => {
        let playsFromDom = document.querySelectorAll('.saisonItem')

        return Array.from(playsFromDom).map(item => item.querySelector('a.hiddenLink').href)
    })

    for (let playUrl of playsUrl) {
        let play = await scrapePochePlays(page, playUrl)
        plays.push(play)
    }

    await page.close()
    await context.close()
    await browser.close()

    return plays
}

const poche = () => scrapeFrom(pocheUrl)

exports.poche = poche