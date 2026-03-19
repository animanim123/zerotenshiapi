import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const port = 3000;

app.get("/api/home", async (req, res) => {
    try {

        const response = await axios.get("https://mynimeku.com", {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(response.data);

        const animeOngoing = [];
        const mangaOngoing = [];

        const widget1 = $("div.widget-title h1")
            .eq(0)
            .contents()
            .filter(function () {
                return this.type === "text";
            })
            .text()
            .trim();

        $("article.anime div.animposx").each((i, element) => {

            const poster = $(element).find("img").attr("data-lazy-src")?.replace(/^\/\//, "https://");
            const tipe = $(element).find("div.type").text().trim();
            const status = $(element).find("div.status").text().trim();
            const title = $(element).find("div.title").text().trim();
            const href = $(element).find("a").attr("href");
            const slug = href.split("/").filter(Boolean).pop();
            const eps = $(element).find("div.plyepisode")
                .contents()
                .filter(function () {
                    return this.type === "text";
                })
                .text()
                .trim()
                .split("\n")[0]
                .trim();

            animeOngoing.push({
                title,
                poster,
                tipe,
                status,
                slug,
                href,
                eps
            });

        });

        const widget2 = $("div.widget-title h1")
            .eq(1)
            .contents()
            .filter(function () {
                return this.type === "text";
            })
            .text()
            .trim();

        $("article.manga div.animposx").each((i, element) => {

            const poster = $(element).find("img").attr("data-lazy-src")?.replace(/^\/\//, "https://");
            const tipe = $(element).find("div.type").text().trim();
            const status = $(element).find("div.status").text().trim();
            const title = $(element).find("div.title").text().trim();
            const href = $(element).find("a").attr("href");
            const slug = href.split("/").filter(Boolean).pop();
            const ch = $(element).find("div.plyepisode")
                .contents()
                .filter(function () {
                    return this.type === "text";
                })
                .text()
                .trim()
                .split("\n")[0]
                .trim();


            mangaOngoing.push({
                title,
                poster,
                tipe,
                status,
                slug,
                href,
                ch
            });

        });

        res.json({
            status: "success",
            pembuat: "GAZZ AHAY",
            statusCode: 200,
            statusMessage: "Aman cuy",
            data: {
                [widget1]: animeOngoing,
                [widget2]: mangaOngoing
            }
        });

    } catch (err) {

        res.status(500).json({
            status: "error",
            message: err.message
        });

    }
});

app.get("/api/series/:slug", async (req, res) => {
    const slug = req.params.slug;
    const url = `https://www.mynimeku.com/series/${slug}/`;
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        })

        const $ = cheerio.load(response.data);

        const poster = $("div.infoanime").children("div.thumb").children("img").attr("data-lazy-src")?.replace(/^\/\//, "https://");
        const title = $("div.infox").children("h1.entry-title").text().trim();
        const rating = $("div.rating-area .rtg i").first().text().trim();
        const description = $("div.desc .entry-content p").first().text().trim();

        const genre = [];

        $("div.genre-info").children("a").each((i, element) => {
            const gen = $(element).text().trim();
            genre.push(gen);
        });

        const info = {};

        const native = $("div.infox .spe span").each((i, el) => {
            const label = $(el).find("b").text().trim();
            const value = $(el).clone().children("b").remove().end().text().trim();

            info[label] = value;
        })

        const headingeps = $("div.animetitle-episode span").text().trim();

        const episodelist = []
        
        $(".eps-wrapper").each((i, el) => {
          const episode = $(el).find(".epsright .eps a").text().trim();
          const episodetitle = $(el).find(".epsleft .lchx a").clone().children("span").remove().end().text().trim();
          const episodestatus = $(el).find(".epsleft .lchx a .newchlabel").text().trim();
          const episodedate = $(el).find(".epsleft .lchx .date").text().trim();
          const episodehref = $(el).find(".epsleft .lchx a").attr("href");
          const episodeId = episodehref.split("/").filter(Boolean).pop();

          episodelist.push({
            episode,
            episodetitle,
            episodestatus,
            episodedate,
            episodehref,
            episodeId
          })
        })

        res.json({
            status: "success",
            pembuat: "GAZZ AHAY",
            statusCode: 200,
            statusMessage: "Aman cuy",
            data: {
                poster,
                title,
                rating,
                genre,
                description,
                info,
                headingeps,
                episodelist
            }
        })

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
});



app.listen(port, () => {
    console.log("API jalan di http://localhost:3000/api/home");
});