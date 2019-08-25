export default function documentReady () {
  if (document.readyState === "loading") {
    return new Promise((resolve) => {
      document.addEventListener('DOMContentLoaded', resolve)
    })
  } else {
    return Promise.resolve()
  }
}