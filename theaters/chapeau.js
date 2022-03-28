// const puppeteer = require('puppeteer')
const { chromium } = require('playwright')


const baseurl = "https://lepetitchapeaurondrouge.be/a-laffiche/"

const scrapUrls = async (url) => { 
	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	await page.goto(url)



	const playURL = await page.evaluate(() => 
		Array.from(document.querySelectorAll('.post-content .heading-link')).map((playUrl) => 
			playUrl.href
	)
)


	// console.log(playURL)

	await browser.close()

	return scrapContent(playURL)

}

const scrapContent = async (urls) => {
	let playData = []

	const browser = await chromium.launch({headless: true})
	const page = await browser.newPage()

	for (let i = 0; i < urls.length; i++) {
		play = {}
		await page.goto(urls[i])

	
		play.theater = 'Le Petit Chapeau Rond Rouge'
		play.title = await page.evaluate(() => document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-8.col-md-8.col-lg-8.titleDetail h1').innerText)
		play.date = await page.evaluate(() => document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4.info h2').innerText)
		play.category = await page.evaluate(() => document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .category').innerText)
		// play.time= await page.evaluate (() =>document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4.info p:nth-of-type(1)').innerText)
		play.duration = await page.evaluate (() =>document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4.info p:nth-of-type(2)').innerText)
		play.bookingUrl = await page.evaluate (() =>document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4 a.btnAB').href)
		play.summary = await page.evaluate (() => {
			let par= document.querySelectorAll('.contenu p')
			let paragraphArr = Array.from(par).map(paragraph => paragraph.textContent)	
			return paragraphArr.join('\n')
		})
		play.image = await page.evaluate(() => document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-12.col-md-12.col-lg-12 .alignleft.poster').src)
		play.production = await page.evaluate (() =>document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4.info p:nth-of-type(4)') ? document.querySelector('#content .post.spectacle.type-spectacle.status-publish.hentry.statut-external .post-content .row.marginFormDet .col-xs-12.col-sm-4.col-md-4.col-lg-4.info p:nth-of-type(4)').innerText :"")
		play.director = ''
		play.age = ''
		
		playData.push(play)
	}
	await browser.close()

	return playData
}

scrapUrls(baseurl)

const chapeau = () => scrapUrls(baseurl)

exports.chapeau = chapeau