// https://www.theatreduparc.be/

const { chromium } = require('playwright')

const seasonUrl = 'https://www.theatreduparc.be/saison-en-cours/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theater = 'Théâtre du Parc'
    play.title = await page.evaluate(() => {
        const element = document.querySelector('h1')
        return element ? element.textContent.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))) : ''
    })
    // console.log(play.title)
    play.date = await page.evaluate(() => {
        const element = document.querySelector('.info-spectacle p:first-of-type')
        return element ? element.textContent.trim() : ''
    })
    play.image = await page.evaluate(() => {
        const element = document.querySelector('.main section.container aside.info div.img-thumb img')
        return element ? element.src : ''
    })

    play.director = await page.evaluate(() => {
        const element = document.querySelector('.info-spectacle p.mb-0')
        return element ? element.textContent.split('Mise en scène ')[1].trim() : document.querySelector('.info-spectacle h2').textContent.split('Création théâtre de ')[1]
    })
    play.bookingUrl = await page.evaluate(() => {
        const element = document.querySelector('.main .billet-cta a')
        return element ? element.href : document.querySelector('.content-description p:last-child a') ? document.querySelector('.content-description p:last-child a').href : ''
    })
    play.summary = await page.evaluate(() => {
        const element = document.querySelector('.content-description')
        return element ? element.textContent.trim() : ''
    })
    play.duration = await page.evaluate(() => {
        const element = document.querySelector('.main section.container aside.info div div div:not([class]) p')
        return element ? element.textContent.trim().toLowerCase() : ''
    })
    play.age = await page.evaluate(() => {
        const element = document.querySelector('.main section.container aside.info div div div:not([class]) span.pl-0.h5.d-block')
        return element ? element.textContent.toLowerCase() : ''
    })
    play.production = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.lightfont.mb-2'))
        .map(text => text.textContent.split(/\n\s+/).join('\n')).join('\n')
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
        let playCardSelector = document.querySelectorAll('.card-event')

        let playsFromDom = Array.from(playCardSelector).filter((item, k) => {
            if (k < playCardSelector.length - 4) return item
        })

        return Array.from(playsFromDom).map(item => item.querySelector('a.shadow').href)
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

const theatreduparc = () => scrapeFrom(seasonUrl)

exports.theatreduparc = theatreduparc