const puppeteer = require('puppeteer')


const balsamineUrl = "https://balsamine.be/#list-display"


const scrapUrlsBalsamine = async (url) => { 
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)

	const balsamineURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('.schedule__item a:not(.reservation-link)')).map((laBalsamineUrl) => 
			laBalsamineUrl.href
	)
)

	// return balsamineURL

	await browser.close()

	scrapContentBalsamine(balsamineURL)

}


const scrapContentBalsamine = async (urls) => {
	let theaterBalsamineData = []

	
	// url = urls[0]
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		play = {}
		await page.goto(urls[i])
		await page.waitForTimeout(1000);

		play.theater = 'La Balsamine'

		// play.image = await page.evaluate(() => document.querySelector('.spectacle__poster img').src)

		play.title = await page.evaluate(() => document.querySelectorAll('.schedule__item .schedule__title')[23] ? document.querySelectorAll('.schedule__item .schedule__title')[23].textContent : '' )

		play.production = await page.evaluate(() => document.querySelector('dl') ? document.querySelector('dl').textContent.trim() : '' )
			
		play.dates = await page.evaluate(() => document.querySelector('.schedule__dates') ? document.querySelector('.schedule__dates').textContent.trim() : '' )

		play.booking = await page.evaluate(() => document.querySelector('.reservation a') ? document.querySelector('.reservation a').href : '' 

		)	
		 play.summary = await page.evaluate(() => {	
				let content = document.querySelector('.content')
				if (content) {
				let a = content.innerHTML.split('<dl')
				let div = document.createElement('div')
				div.innerHTML = a[0]
				return content.querySelector('dl') ? div.textContent.trim() : ''
			}})

		theaterBalsamineData.push(play)

	
		// }
	}
	await browser.close()
	return theaterBalsamineData

}

// scrapUrlsBalsamine(balsamineUrl)  

const balsamine = () => scrapUrlsBalsamine(balsamineUrl)  

exports.balsamine = balsamine