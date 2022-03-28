const { chromium } = require('playwright')

const seasonUrl = 'https://www.theatrenational.be/fr/program/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theatre = 'Théâtre National'
    play.title = await page.evaluate(() => document.querySelector('.page-header h1.title').textContent)
    play.image = await page.evaluate(() => (document.domain + document.querySelector('.banner--main-image .lqip img').dataset.srcset.split(', ')[2].split(' ')[0]))

    play.date = await page.evaluate(() => document.querySelector('.page-header div.subtitle.subtitle--header').textContent)
    play.director = await page.evaluate(() => document.querySelector('.page-header h3.subtitle') ? document.querySelector('.page-header h3.subtitle').textContent : '')
    play.bookingUrl = await page.evaluate(() => 
        document.querySelector('.page-header a.cta.cta--main.icon.icon--ticket') ? document.querySelector('.page-header a.cta.cta--main.icon.icon--ticket').href : ''
    )
    play.summary = await page.evaluate(() => {
        const element = document.querySelector('.main__right article.section div.body.text')
        return element ? element.textContent.trim() : ''
    })
    play.duration = await page.evaluate(() => {
        const element = document.querySelector('.main__right section.section ul.infos.columns li h4.icon--time-black + p')
        return element ? element.textContent.trim() : ''
    })
    play.age = ''
    play.production = await page.evaluate(() => {
        const element = document.querySelector('ul.cast')
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
        let playsFromDom = Array.from(document.querySelectorAll('.list.list--grid .item.item--activity'))
        .map(play => {
            let isAPlay = false
            let tags = play.querySelectorAll('.cats .cats__item .cats__link')
            
            tags.forEach(tag => {
                if (tag.textContent === 'théâtre' || tag.textContent === 'danse') {
                    isAPlay = true
                }
            })

            if (isAPlay) return play
            else return ''
        })
        .filter(play => play) // remove undefined

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
}

const theatrenational = () => scrapeFrom(seasonUrl)

exports.theatrenational = theatrenational