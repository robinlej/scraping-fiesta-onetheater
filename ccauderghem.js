const puppeteer = require('puppeteer')


const CcAuderghemUrl = "https://ccauderghem.be/la-saison/"


const scrapUrlsAuderghem = async (url) => { 
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)


	const theaterAuderghemURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('div.grid .card__spectacle .card--header a')).map((theaterAuderghemUrl) => 
			theaterAuderghemUrl.href
	)
)

	// const barName = await page.evaluate(() => document.querySelectorAll('.bUshh.o.csemS'))
	// return theaterAuderghemURL

	await browser.close()

	return scrapContentAuderghem(theaterAuderghemURL)

}


const scrapContentAuderghem = async (urls) => {
	let theaterAuderghemData = []

	
	// url = urls[0]
	const browser = await puppeteer.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		play = {}
		await page.goto(urls[i])
		await page.waitForTimeout(1000);

		play.theater = 'Centre Culturel D Auderghem' 

		play.image = await page.evaluate(() => document.querySelector('.relative .mb-2 img') ? document.querySelector('.relative .mb-2 img').src : '')

		play.title = await page.evaluate(() => document.querySelector('.col-span-8 .text-h1') ? document.querySelector('.col-span-8 .text-h1').textContent : '' )

		play.production = await page.evaluate(() => document.querySelector('.p-4 p:first-of-type') ? document.querySelector('.p-4 p:first-of-type').textContent : '' )
			
		play.dates = await page.evaluate(() => document.querySelector('.col-span-8 .mx-auto') ? document.querySelector('.col-span-8 .mx-auto').textContent.trim() : '' )

		play.booking = await page.evaluate(() => document.querySelector('.main article .utick .col-span-8 .grid-cols-2 .mt-6 a.btn') ? document.querySelector('.main article .utick .col-span-8 .grid-cols-2 .mt-6 a.btn').href : '' 

		)	
		 play.summary = await page.evaluate(() => {
			 	let summary = Array.from(document.querySelectorAll('.utick .p-4 p:not(:first-of-type)')).map((summary) => {
				return summary.textContent 
	    	 	})	 
	    	 	return summary.join('\n')										
    	}) 

		theaterAuderghemData.push(play)

	
		// }
	}
	await browser.close()
	return theaterAuderghemData

}


 const CentreCultureAuderghem = () =>  scrapUrlsAuderghem(CcAuderghemUrl)  


 exports.CentreCultureAuderghem = CentreCultureAuderghem