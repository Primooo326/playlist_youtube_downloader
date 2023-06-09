import yt from "./yt";

const url =
  "https://www.youtube.com/playlist?list=PLbJr1Hz1efqR0pdiT5HxCLmx19-ziVAtz";
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
