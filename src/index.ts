import yt from "./yt";

const app = new Promise((resolve, reject) => {
  try {
    resolve(yt("PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K"));
  } catch (error) {
    reject(error);
  }
});

app.then((response) => {
  console.log("response:", response);
});
