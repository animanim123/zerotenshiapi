import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

app.get("/", (req, res) => {
    res.json({
        status: "API hidup 🚀",
        endpoint: ["/home", "/info", "/content"]
    });
});

app.get("/home", async (req, res) => {
    try {
        const response = await axios.get("https://mynimeku.com", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/",
                "Origin": "https://www.google.com",
                "Connection": "keep-alive"
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        const animeOngoing = [];
        const mangaOngoing = [];

        $("article.anime div.animposx").each((i, element) => {
            const img = $(element).find("img");
            const getposter = img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
            const poster = getposter?.replace(/^\/\//, "https://");

            const tipe = $(element).find("div.type").text().trim();
            const status = $(element).find("div.status").text().trim();
            const title = $(element).find("div.title").text().trim();
            const href = $(element).find("a").attr("href");
            const slug = href.split("/").filter(Boolean).pop();
            const katslug = new URL(href).pathname.substring(1);
            const eps = $(element)
                .find("div.plyepisode")
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
                katslug,
                href,
                eps,
            });
        });

        $("article.manga div.animposx").each((i, element) => {
            const poster = $(element)
                .find("img")
                .attr("data-lazy-src")
                ?.replace(/^\/\//, "https://");
            const tipe = $(element).find("div.type").text().trim();
            const status = $(element).find("div.status").text().trim();
            const title = $(element).find("div.title").text().trim();
            const href = $(element).find("a").attr("href");
            const slug = href.split("/").filter(Boolean).pop();
            const katslug = new URL(href).pathname.substring(1);
            const ch = $(element)
                .find("div.plyepisode")
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
                katslug,
                href,
                ch,
            });
        });

        res.json({
            status: "success",
            pembuat: "GAZZ AHAY",
            statusCode: 200,
            statusMessage: "Aman cuy",
            data: {
                ["series"]: animeOngoing,
                ["komik"]: mangaOngoing,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

app.get("/info/:katslug/*", async (req, res) => {
    const katslug = req.params[0];
    const url = `https://www.mynimeku.com/${katslug}/`;
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/",
                "Origin": "https://www.google.com",
                "Connection": "keep-alive"
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        const img = $(element).find("img");
        const getposter = img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
        const poster = getposter?.replace(/^\/\//, "https://");
        
        const title = $("div.infox").children("h1.entry-title").text().trim();
        const rating = $("div.rating-area .rtg i").first().text().trim();
        const description = $("div.desc .entry-content p").first().text().trim();

        const genre = [];

        $("div.genre-info")
            .children("a")
            .each((i, element) => {
                const gen = $(element).text().trim();
                genre.push(gen);
            });

        const info = {};

        const native = $("div.infox .spe span").each((i, el) => {
            const label = $(el).find("b").text().trim();
            const value = $(el).clone().children("b").remove().end().text().trim();

            info[label] = value;
        });

        const heading = $("div.animetitle-episode span").text().trim();

        const episodelist = [];
        const chapterlist = [];

        $(".eps-wrapper").each((i, el) => {
            const episode = $(el).find(".epsright .eps a").text().trim();
            const episodetitle = $(el)
                .find(".epsleft .lchx a")
                .clone()
                .children("span")
                .remove()
                .end()
                .text()
                .trim();
            const episodestatus = $(el)
                .find(".epsleft .lchx a .newchlabel")
                .text()
                .trim();
            const episodedate = $(el).find(".epsleft .lchx .date").text().trim();
            const episodehref = $(el).find(".epsleft .lchx a").attr("href");
            const katepisode = new URL(episodehref).pathname.substring(1);
            const episodeId = episodehref.split("/").filter(Boolean).pop();

            episodelist.push({
                episode,
                episodetitle,
                episodestatus,
                episodedate,
                episodehref,
                katepisode,
                episodeId,
            });
        });

        $(".chap-wrapper").each((i, el) => {
            const chapter = $(el).find(".epsright .eps a").text().trim();
            const chaptertitle = $(el)
                .find(".epsleft .lchx a")
                .clone()
                .children("span")
                .remove()
                .end()
                .text()
                .trim();
            const chapterstatus = $(el)
                .find(".epsleft .lchx a .newchlabel")
                .text()
                .trim();
            const chapterdate = $(el).find(".epsleft .lchx .date").text().trim();
            const chapterhref = $(el).find(".epsleft .lchx a").attr("href");
            const katchapter = new URL(chapterhref).pathname.substring(1);
            const chapterId = chapterhref.split("/").filter(Boolean).pop();

            chapterlist.push({
                chapter,
                chaptertitle,
                chapterstatus,
                chapterdate,
                chapterhref,
                katchapter,
                chapterId,
            });
        });

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
                heading,
                list: episodelist.length > 0 ? episodelist : chapterlist,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

app.get("/content/:katcontent/*", async (req, res) => {
    const katcontent = req.params[0];
    const url = `https://www.mynimeku.com/${katcontent}/`;

    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.google.com/",
                "Origin": "https://www.google.com",
                "Connection": "keep-alive"
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);

        const titleepsode = $(".widget_senction ol li a span").last().text().trim();

        const servers1 = [];
        const servers2 = [];


        $(".server-buttons .server-btn").slice(0, 6).each((i, el) => {
            const server = $(el).attr("data-player-url");
            const servertitle = $(el).text().trim();

            servers1.push({
                server,
                servertitle,
            });
        });

        $(".server-buttons .server-btn").slice(7, 12).each((i, el) => {
            const server = $(el).attr("data-player-url");
            const servertitle = $(el).text().trim();

            servers2.push({
                server,
                servertitle,
            });
        });

        const komik = []
        $(".reader-area img").each((i, el) => {
            const img = $(el).attr("src")?.replace(/^\/\//, "https://");
            const imgId = $(el).attr("img-id");
            komik.push({
                img,
                imgId
            })
        })

        res.json({
            status: "success",
            pembuat: "GAZZ AHAY",
            statusCode: 200,
            statusMessage: "Aman cuy",
            data: {
                titleepsode,
                ["public"]: servers1,
                ["private"]: servers2,
                komiks: komik
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

app.get("/image", async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).send("URL tidak ada");
        }

        const response = await axios.get(url, {
            responseType: "arraybuffer",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Referer": "https://www.mynimeku.com/",
                "Origin": "https://www.mynimeku.com",
                "Connection": "keep-alive"
            }
        });

        res.set("Content-Type", response.headers["content-type"]);
        res.send(response.data);

    } catch (err) {
        res.status(500).send("Gagal ambil gambar");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});     