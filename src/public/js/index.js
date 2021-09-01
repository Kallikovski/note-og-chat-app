import {
  autoscroll,
  renderMessageHeadTemplate,
  renderMessageTextTemplate,
  renderMessageUrlTemplate,
  renderOgTemplate,
  renderRoomDataTemplate
} from './handler/uiHandler.js'

const socket = io()

// User text submittion
const submitMessage = (form) => {
  const $messageFormInput = form.querySelector('textarea')
  const $messageFormButton = form.querySelector('button')
  const $loaderIcon = form.querySelector('#loader')

  $messageFormButton.setAttribute('disabled', 'disabled')
  $loaderIcon.classList.add("loader")

  const message = form.elements.message.value
  $messageFormInput.value = ''

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')

    if (error) {
      $loaderIcon.classList.remove("loader")
      return console.log(error)
    }
    $loaderIcon.classList.remove("loader")
    console.log('Message delivered!')
  })
  $messageFormInput.focus()
}

document.querySelector('#message-form').addEventListener("submit", (e) => {
  e.preventDefault()
  submitMessage(e.target)
})

document.querySelector('#message-form').addEventListener("keydown", (e) => {
  const keyCode = e.which || e.keyCode
  if (keyCode === 13 && !e.shiftKey) {
    submitMessage(e.target.parentElement)
  }
})


// Qs parser options
const {
  username,
  room,
  color
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

// Recieving user messages
socket.on('message', (message) => {
  renderMessageHeadTemplate(message)
  const ogUrls = []
  message.text.forEach(text => {
    if(Object.keys(text)[0] === 'text'){
      renderMessageTextTemplate(text.text)
    }
    else{
      renderMessageUrlTemplate(text.url)
      if(text.urlOgMetas !== {}){
        ogUrls.push({url: text.url, urlOgMetas: text.urlOgMetas})
      }
    }
  });
  ogUrls.forEach(ogUrl => {
    if(Object.keys(ogUrl.urlOgMetas).length !== 0){
      renderOgTemplate(ogUrl.url, ogUrl.urlOgMetas)
    } 
  })
  autoscroll()
})

// Recieving room data
socket.on('roomData', ({
  room,
  users
}) => {
  renderRoomDataTemplate(room, users)
})

socket.emit('join', {
  username,
  room,
  color
}, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
