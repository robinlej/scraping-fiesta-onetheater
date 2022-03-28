
// const puppeteer = require('puppeteer')
const { chromium } = require('playwright')


const toisonUrl = "http://www.ttotheatre.com/spectacles/"


const scrapUrlsToison = async (url) => { 
	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)


	const theaterToisonURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('.programme .spectacle-item__content .spectacle-item__header a')).map((theaterToisonUrl) => 
			theaterToisonUrl.href
	)
)

	// const barName = await page.evaluate(() => document.querySelectorAll('.bUshh.o.csemS'))
	// return theaterToisonURL

	await browser.close()

	return scrapContentToison(theaterToisonURL)

}


const scrapContentToison = async (urls) => {
	let theaterToisonData = []

	
	// url = urls[0]
	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		play = {}
		await page.goto(urls[i])
		await page.waitForTimeout(1000);

		play.theater = 'TTO Théâtre'

		play.image = await page.evaluate(() => document.querySelector('.spectacle__poster img').src)

		play.title = await page.evaluate(() => document.querySelector('.main .spectacle .spectacle__intro .pull-left h1') ? document.querySelector('.main .spectacle .spectacle__intro .pull-left h1').textContent : '' )

		play.director = await page.evaluate(() => document.querySelector('.auteur span') ? document.querySelector('.auteur span').textContent : '')

		play.production = await page.evaluate(() => document.querySelector('.main .spectacle .spectacle__distribution p:nth-of-type(3)') ? document.querySelector('.main .spectacle .spectacle__distribution p:nth-of-type(3)').textContent || document.querySelector('.main .spectacle .spectacle__distribution p:nth-of-type(2)').textContent : '' )
			
		play.date = await page.evaluate(() => document.querySelector('.main .spectacle .spectacle__dates') ? document.querySelector('.main .spectacle .spectacle__dates').textContent.split('\n\t\t\t\t\t\t\t\t\t')[1].split('\n\t\t\t\t\tDu mercredi au samedi à 20h30\n\t\t\t\t')[0] : '' )

		play.bookingUrl = await page.evaluate(() => document.querySelector('.main .spectacle .spectacle__reservations a') ? document.querySelector('.main .spectacle .spectacle__reservations a').href : '' 

		)	
		 play.summary = await page.evaluate(() => document.querySelector('.main .spectacle .spectacle__content p:nth-of-type(2)') ? document.querySelector('.main .spectacle .spectacle__content p:nth-of-type(2)').textContent : '' )

		play.age = ''
		
		play.duration = ''

		theaterToisonData.push(play)

	
		// }
	}
	await browser.close()
	return theaterToisonData

}

 const ToisonDor = () =>  scrapUrlsToison(toisonUrl)  

exports.ToisonDor = ToisonDor