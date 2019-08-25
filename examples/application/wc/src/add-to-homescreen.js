if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
  }
}

let defferedPrompt

export const showAddToHomeScreen = function () {
  let notification = document.querySelector('#add-to-home-screen')
  if (!notification) {
    notification = document.createElement('div')
    notification.setAttribute('id', 'add-to-home-screen')
    notification.innerHTML = `
      <style>
        #add-to-home-screen {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.7);
          padding: 0.3rem;
          background: #f15924;
          color: white;
          font-size: 0.5rem;
        }

        #add-to-home-screen span {
          display: inline-block;
          background: '#f15924';
          cursor: pointer;
        }
      </style>
      <span>Add to home screen</span> | <span>Dismiss</span>
    `;
    const buttons = Array.from(notification.querySelectorAll('span'))
    const [addToHomeScreenButton, dismissButton] = buttons
    addToHomeScreenButton.onclick = () => {
      defferedPrompt.prompt().then(() => {
        defferedPrompt.userChoice.then(() => {
          defferedPrompt = null
        })
      })
      notification.remove()
    }
    dismissButton.onclick = () => {
      notification.remove()
    }
    document.body.appendChild(notification)
  }
}

window.addEventListener('beforeinstallprompt', e => {
  defferedPrompt = e
  showAddToHomeScreen()
})