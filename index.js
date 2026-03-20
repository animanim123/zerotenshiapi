import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();

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
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
            },
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

        const widget2 = $("div.widget-title h1")
            .eq(1)
            .contents()
            .filter(function () {
                return this.type === "text";
            })
            .text()
            .trim();

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
                [widget1]: animeOngoing,
                [widget2]: mangaOngoing,
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
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
            },
        });

        const $ = cheerio.load(response.data);

        const poster = $("div.infoanime")
            .children("div.thumb")
            .children("img")
            .attr("data-lazy-src")
            ?.replace(/^\/\//, "https://");
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
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html",
            },
        });

        const $ = cheerio.load(response.data);

        const titleepsode = $(".widget_senction ol li a span").last().text().trim();

        const servers1 = [];
        const servers2 = [];

        const heading1 = $(".server-group h4").eq(0).text().trim();

        $(".server-buttons .server-btn").slice(0, 6).each((i, el) => {
            const server = $(el).attr("data-player-url");
            const servertitle = $(el).text().trim();

            servers1.push({
                server,
                servertitle,
            });
        });

        const heading2 = $(".server-group h4").eq(1).text().trim();

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

        const nav = []

        const next = $(".nevxs .rght a").attr("href");
        const katnext = new URL(next).pathname.substring(1);
        const nextId = next.split("/").filter(Boolean).pop();
        const prev = $(".nevxs .nvs a").attr("href");
        const katprev = new URL(prev).pathname.substring(1);
        const prevId = prev.split("/").filter(Boolean).pop();

        nav.push({
            next,
            katnext,
            nextId,
            prev,
            katprev,
            prevId
        })

        res.json({
            status: "success",
            pembuat: "GAZZ AHAY",
            statusCode: 200,
            statusMessage: "Aman cuy",
            data: {
                titleepsode,
                [heading1]: servers1,
                [heading2]: servers2,
                komiks: komik,
                nav
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server jalan di port " + PORT);
});