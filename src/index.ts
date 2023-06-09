import yt from "./yt";

const url =
  "https://youtube.com/playlist?list=PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K";
const app = new Promise((resolve, reject) => {
  try {
    resolve(yt(url));
  } catch (error) {
    reject(error);
  }
});

app
  .then((response) => {
    console.log("response:", response);
  })
  .catch((error) => {
    console.log("error:::", error.message);
    if (error.message === `Unable to find a id in "${url}"`) {
      console.log(`intenta hacer publica la lista de reproduccion ${url}`);
    }
  });
