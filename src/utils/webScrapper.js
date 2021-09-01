const puppeteer = require('puppeteer');

// const initBrowser = async () => await puppeteer.launch({
//   headless: true,
//   defaultViewport: null,
//   args: [
//       "--incognito",
//       "--no-sandbox",
//       "--single-process",
//       "--no-zygote"
//   ],
// });

//const initPage = async (browser) => (await browser).newPage()

//const gBrowser = initBrowser()
// const gPage = initPage(gBrowser)

let gPage
(async () => {
  const gBrowser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: [
        "--incognito",
        "--no-sandbox",
        "--single-process",
        "--no-zygote"
    ],
  });
  gPage = await gBrowser.newPage()
  console.log('Init Browser')
})();


generateOgMetas = async (url) => {
  const page = await gPage
  await page.goto(url)
  const ogMetas = {}
  try {
    ogMetas.description = await page.$eval('meta[property="og:description"]', element => element.content)
  } catch (e) {
    console.log('No decription')
  }
  try {
    ogMetas.title = await page.$eval('meta[property="og:title"]', element => element.content)
  } catch (e) {
    console.log('No title')
  }
  try {
    ogMetas.site_name = await page.$eval('meta[property="og:site_name"]', element => element.content)
  } catch (e) {
    console.log('No Type')
  }
  try {
    ogMetas.image = await page.$eval('meta[property="og:image"]', element => element.content)
  } catch (e) {
    console.log('No image')
  }
  return ogMetas
}

module.exports = {
  generateOgMetas
}
