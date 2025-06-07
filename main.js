async function triggerFetch() {
    try {
        const res = await fetch("https://en.wikipedia.org/api/rest_v1/page/random/summary");
        const data = await res.json();
        const imageUrl = data.thumbnail?.source || "https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png";

        document.getElementById("image-container").innerHTML = `
            <p>Obrázek z Wikipedie:</p>
            <img src="${imageUrl}" alt="wiki obrazek" style="max-width:300px;">
        `;

        if (!("Notification" in window)) return;
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        // Send a message to the service worker to display the notification
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'DISPLAY_NOTIFICATION',
                title: "Obrázek je tu!",
                body: "Náhodný obrázek z Wikipedie",
                icon: imageUrl,
                image: imageUrl
            });
        } else {
            // Fallback for cases where service worker isn't active (shouldn't happen if registered)
            new Notification("Obrázek je tu!", {
                body: "Náhodný obrázek z Wikipedie",
                icon: imageUrl,
                image: imageUrl
            });
        }

        const beep = new Audio("beep.mp3");
        beep.play().catch(e => console.warn("Zvuk nelze přehrát:", e));
    } catch (e) {
        console.error("Chyba při načítání obrázku:", e);
    }
}

if (window.location.search.includes("auto")) {
    window.addEventListener("load", triggerFetch);
}