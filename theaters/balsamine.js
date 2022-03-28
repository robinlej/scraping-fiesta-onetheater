// const puppeteer = require('puppeteer')
const { chromium } = require('playwright')

const balsamineUrl = "https://balsamine.be/#list-display"


const scrapUrlsBalsamine = async (url) => { 
	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)

	const balsamineURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('.schedule__item a:not(.reservation-link)')).map((laBalsamineUrl) => 
			laBalsamineUrl.href
	)
)

	// return balsamineURL

	await browser.close()

	return scrapContentBalsamine(balsamineURL)
	
}


const scrapContentBalsamine = async (urls) => {
	let theaterBalsamineData = []

	
	// url = urls[0]
	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		if (urls[i].search(/^https:\/\/www\.brusselsdance\.eu/) === 0) continue

		play = {}
		await page.goto(urls[i])
		await page.waitForTimeout(1000);

		play.theater = 'La Balsamine'

		play.image = ''

		play.title = await page.evaluate(() => document.querySelectorAll('.schedule__item .schedule__title')[23] ? document.querySelectorAll('.schedule__item .schedule__title')[23].textContent : '' )

		play.director = await page.evaluate(() => document.querySelectorAll('h2.schedule__authors')[20] ? document.querySelectorAll('h2.schedule__authors')[20].textContent.trim() : '')

		play.production = await page.evaluate(() => document.querySelector('dl') ? document.querySelector('dl').textContent.trim() : '' )
			
		play.date = await page.evaluate(() => document.querySelectorAll('.schedule__dates')[23] ? document.querySelectorAll('.schedule__dates')[23].textContent.trim() : '' )

		play.bookingUrl = await page.evaluate(() => document.querySelectorAll('.btn.reservation a')[document.querySelectorAll('.btn.reservation a').length - 1] ? document.querySelectorAll('.btn.reservation a')[document.querySelectorAll('.btn.reservation a').length - 1].href : '' )

		play.summary = await page.evaluate(() => {	
				let content = document.querySelector('.content')
				if (content) {
				let a = content.innerHTML.split('<dl')
				let div = document.createElement('div')
				div.innerHTML = a[0]
				return content.querySelector('dl') ? div.textContent.trim() : ''
			}})
		if (play.summary === '') continue


		play.age = ''

		play.duration = ''

		theaterBalsamineData.push(play)

	
		// }
	}
	await browser.close()
	return theaterBalsamineData

}

scrapUrlsBalsamine(balsamineUrl)
// scrapUrlsBalsamine(balsamineUrl)  

const balsamine = () => scrapUrlsBalsamine(balsamineUrl)  

exports.balsamine = balsamine