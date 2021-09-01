const $messageFormInput = document.querySelector('#message-form textarea');
const $messages = document.querySelector('#messages');


// Template Container
const messageHeadTemplate = document.querySelector('#message-head-template').innerHTML;
const messageTextTemplate = document.querySelector('#message-text-template').innerHTML;
const messageUrlTemplate = document.querySelector('#message-url-template').innerHTML;
const messageOgTemplate = document.querySelector('#message-og-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const autoscroll = () => {
  const chat = document.querySelector('.chat-window');

  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;
  if (
    containerHeight - newMessageHeight <= scrollOffset &&
    document.activeElement === $messageFormInput
  ) {
    chat.scrollTop = $messages.scrollHeight;
  }
};

const renderMessageHeadTemplate = (message) => {
  const html = Mustache.render(messageHeadTemplate, {
    color: `style="color:${message.color}";`,
    username: message.username,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
};

const renderMessageTextTemplate = (message) => {
  const html = Mustache.render(messageTextTemplate, {
    message: message
  });
  $messages.insertAdjacentHTML('beforeend', html);
};

const renderMessageUrlTemplate = (url) => {
  const html = Mustache.render(messageUrlTemplate, {
    url: url
  });
  $messages.insertAdjacentHTML('beforeend', html);
};

const renderOgTemplate = (url, ogMetas) => {
  const html = Mustache.render(messageOgTemplate, {
    siteName: ogMetas.site_name,
    title: ogMetas.title,
    url: url,
    description: ogMetas.description,
    image: ogMetas.image
  });
  $messages.insertAdjacentHTML('beforeend', html);
};

const renderRoomDataTemplate = (room, users) => {
  // console.log(users);
  const userTemps = [];
  users.forEach((user) => {
    userTemps.push({
      userTemp: `<div style="color:${user.color}";>@ ${user.username} </div>`,
    });
  });
  // console.log(userTemps);
  const html = Mustache.render(sidebarTemplate, {
    room,
    userTemps,
  });
  document.querySelector('#sidebar').innerHTML = html;
};

export {
  autoscroll,
  renderMessageHeadTemplate,
  renderMessageTextTemplate,
  renderMessageUrlTemplate,
  renderOgTemplate,
  renderRoomDataTemplate
};
