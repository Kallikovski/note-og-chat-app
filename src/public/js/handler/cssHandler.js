let darkMode = localStorage.getItem('darkMode')

const darkModeToogle = document.querySelector('#dark-mode-toggle')

window.onload = () => {
  console.log(darkMode)
  if (darkMode === "enabled") {
    document.body.classList.add('darkmode')
  }
}

const enableDarkMode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkMode', "enabled")
}

const disableDarkMode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkMode', null)
}

darkModeToogle.addEventListener('click', () => {
  darkMode = localStorage.getItem('darkMode')
  if (darkMode !== 'enabled') {
    enableDarkMode()
  } else {
    disableDarkMode()
  }
})
