const { chromium } = require('playwright')

const seasonUrl = 'https://trg.be/'

const scrapeEachPlay = async (page, url) => {
    await page.goto(url)

    let play = {}
    
    play.theater = 'Théâtre Royal des Galeries'
    play.title = await page.evaluate(() => document.querySelector('h1.spectacle-title').textContent)
    // console.log(play.title)
    play.date = await page.evaluate(() => document.querySelector('.spectacle-date').textContent.slice(3))

    play.image = await page.evaluate(() => {
        const element = document.querySelector('.vc_gitem-zone.vc_gitem-zone-a.vc-gitem-zone-height-mode-auto.vc-gitem-zone-height-mode-auto-1-1.vc_gitem-is-link')
        return element ? element.style.backgroundImage.slice(5,-2) : ''
    })

    play.director = await page.evaluate(() => {
        const element = document.querySelector('.spectacle-legend span')
        return element ? element.textContent.trim() : ''
    })
    play.bookingUrl = await page.evaluate(() => {
        // const element = document.querySelector('.book-links a.acheter')
        // return element ? element.href : ''
        return 'http://tickets.trg.be/'
    })
    play.summary = await page.evaluate(() => {
        const summaryP = document.querySelector('.wpb_wrapper .wpb_text_column.wpb_content_element .wpb_wrapper').children
        const summaryPContent = Array.from(summaryP).map(p => p.textContent.trim())
        const summaryText = summaryPContent.join('\n')
        return summaryP ? summaryText.trim() : ''
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
        const element = document.querySelector('#ancre-distribution .vc_row.wpb_row.vc_inner.vc_row-fluid.max-width-1000')
        const paragraphs = element.querySelectorAll('p')
        const production = Array.from(paragraphs).map(p => p.textContent.trim()).join(', ')
        return element ? production.trim() : ''
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
        // let playCardSelector = document.querySelectorAll('#agenda-content #Container .mix:not([data-hide="is-hidden"])')
        let links = Array.from(document.querySelectorAll('.trg-aurone-button')).map(link => {
            if (link.querySelector('img[alt="bouton LA PIÈCE"]')) return link.href
        })
        return links = links.filter(link => {
            if (link !== undefined) return link
        })

        // let playsFromDom = Array.from(playCardSelector)

        // return Array.from(playsFromDom).map(item => item.querySelector('a.post-link').href)
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
const trg = () => scrapeFrom(seasonUrl)
exports.trg = trg