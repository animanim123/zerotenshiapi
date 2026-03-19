import axios from "axios";
import * as cheerio from "cheerio";

axios.get("https://www.mynimeku.com").then((res) => {
  const $ = cheerio.load(res.data);

  const widget1 = $("div.widget-title")
    .find("h1")
    .eq(0)
    .contents()
    .filter(function () {
      return this.type === "text";
    })
    .text()
    .trim();

  console.log(widget1);

  $("article.anime")
    .find("div.animepost")
    .children("div.animposx")
    .each((i, element) => {
      const poster = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("img")
        .attr("data-lazy-src");
      const tipe = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("div.type")
        .text();
      const status = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("div.status")
        .text();
      const title = $(element)
        .find("div.data")
        .children("a")
        .children("div.title")
        .text();

      console.log(
        `${i + 1}. Poster: ${poster}, Tipe: ${tipe}, Status: ${status}, Title: ${title}`,
      );
    });

  const widget2 = $("div.widget-title")
    .find("h1")
    .eq(1)
    .contents()
    .filter(function () {
      return this.type === "text";
    })
    .text()
    .trim();

  console.log(widget2);

  $("article.manga")
    .find("div.animepost")
    .children("div.animposx")
    .each((i, element) => {
      const poster = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("img")
        .attr("data-lazy-src");
      const tipe = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("div.type")
        .text();
      const status = $(element)
        .find("a")
        .children("div.content-thumb")
        .children("div.status")
        .text();
      const title = $(element)
        .find("div.data")
        .children("a")
        .children("div.title")
        .text();

      console.log(
        `${i + 1}. Poster: ${poster}, Tipe: ${tipe}, Status: ${status}, Title: ${title}`,
      );
    });
});
