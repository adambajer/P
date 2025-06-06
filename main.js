async function fetchAndNotify() {
  const imageUrl = await getRandomWikiImage();
  if (!("Notification" in window)) return alert("Notifikace nejsou podporovány");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return alert("Notifikace zakázány");

  const beep = new Audio("beep.mp3");
  beep.play();

  new Notification("Obrázek je tu!", {
    body: "Náhodný obrázek z Wikipedie",
    icon: imageUrl,
    image: imageUrl
  });
}

async function getRandomWikiImage() {
  const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
  const data = await res.json();
  return data.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png";
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}