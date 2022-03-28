const puppeteer = require('puppeteer')

//LE RIDEAU

const baseurl = "https://lerideau.brussels/spectacles/saison/2021-2022"

const scrapUrls = async (url) => { 
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)


	const theaterURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('.spectacles-list__item:not(.spectacles-list__item--past')).map((theaterUrl) => 
			theaterUrl.href
	)
)

	// const barName = await page.evaluate(() => document.querySelectorAll('.bUshh.o.csemS'))
	// return theaterURL

	await browser.close()

	scrapContent(theaterURL)

}

// const scrap = async (ref) => {
	


const scrapContent = async (urls) => {
	let theaterData = []

	
	// url = urls[0]
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		play = {}
		await page.goto(urls[i])
		await page.waitForTimeout(1000);

		play.theater = 'Le Rideau'

		play.image = await page.evaluate(() => document.querySelector('.main__image img').src)

		play.title = await page.evaluate(() => document.querySelector('.main__text .main__text__left').textContent.trim())

		play.production = await page.evaluate(() => document.querySelector('.content__credits').textContent.trim())
			
		play.dates = await page.evaluate(() => document.querySelector('.text__timeframe').textContent.trim())

		play.booking = await page.evaluate(() => document.querySelector('.dates__reservation-link') ? document.querySelector('.dates__reservation-link').href || document.querySelector('.dates__list__link a').href : '' 

		)	
		play.summary = await page.evaluate(() => document.querySelector('.informations__text .text__synopsis').textContent.trim())

		theaterData.push(play)

	
		// }
	}
	await browser.close()
	return theaterData
}


 const lerideau = () => scrapUrls(baseurl)
	


exports.lerideau = lerideau
