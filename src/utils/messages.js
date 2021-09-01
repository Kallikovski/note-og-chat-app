const {
  generateOgMetas
} = require("./webScrapper")

const generateMessage = async (username, color, text) => {
  const urls = getMessageUrls(text)
  if (urls !== null) {
    text = await generateMesssageArr(urls, text)
    // test(urls)
  }
  else{
    text = [{text: text}]
  }
  return {
    username,
    color,
    text,
    createdAt: new Date().getTime()
  }
}
// Returns a list of possible URLs contained in the user message
const getMessageUrls = (text) => {
  const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  const urls = text.match(urlRegex)
  return urls
}

// Generates message with open graph properties
const generateMesssageArr = async (urls, text) => {
  const messageArr = []
  for (const url of urls) {
    const preUrl = text.split(url)[0]
    if(preUrl !== '')
    {
      messageArr.push({text: text.split(url)[0]})
      text = text.replace(preUrl,'')
    }
    const urlOgMetas = await generateOgMetas(url)
    messageArr.push({url, urlOgMetas})
    text = text.replace(url,'')
  }
  if(text.trim() !== ''){
    messageArr.push({text})  
  }
  return messageArr
}

module.exports = {
  generateMessage
}
