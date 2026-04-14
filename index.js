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
    endpoint: ["/home", "/info", "/content"],
  });
});

app.get("/home", async (req, res) => {
  try {
    const response = await axios.get("https://mynimeku.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const animeOngoing = [];
    const mangaOngoing = [];

    $(".mynimeku-update-widget__list .mynimeku-update-widget__item").each(
      (i, element) => {
        const img = $(element).find("img");
        const getposter =
          img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
        const poster = getposter?.replace(/^\/\//, "https://");

        const tipe = $(element)
          .find(".mynimeku-update-widget__type")
          .text()
          .trim();

        const status = $(element)
          .find(".mynimeku-update-widget__status")
          .text()
          .trim();

        const title = $(element)
          .find(".mynimeku-update-widget__series-title")
          .text()
          .trim();

        const href = $(element)
          .find(".mynimeku-update-widget__series-title")
          .attr("href");

        const slug = href?.split("/").filter(Boolean).pop();
        const katslug = href ? new URL(href).pathname.substring(1) : "";

        const eps = $(element)
          .find(".mynimeku-update-widget__latest-pill")
          .text()
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
      },
    );

    $(".mynimeku-update-widget__list .mynimeku-update-widget__item").each(
      (i, element) => {
        const img = $(element).find("img");
        const getposter =
          img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
        const poster = getposter?.replace(/^\/\//, "https://");

        const tipe = $(element)
          .find(".mynimeku-update-widget__type")
          .text()
          .trim();

        const status = $(element)
          .find(".mynimeku-update-widget__status")
          .text()
          .trim();

        const title = $(element)
          .find(".mynimeku-update-widget__series-title")
          .text()
          .trim();

        const href = $(element)
          .find(".mynimeku-update-widget__series-title")
          .attr("href");

        const slug = href?.split("/").filter(Boolean).pop();
        const katslug = href ? new URL(href).pathname.substring(1) : "";

        const ch = $(element)
          .find(".mynimeku-update-widget__latest-pill")
          .text()
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
      },
    );

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

app.get("/info/:type/*", async (req, res) => {
  const type = req.params.type;
  const slug = req.params[0];
  const url = `https://www.mynimeku.com/${type}/${slug}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
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
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const titleepsode = $(".widget_senction ol li a span").last().text().trim();

    const servers1 = [];
    const servers2 = [];

    $(".server-buttons .server-btn")
      .slice(0, 6)
      .each((i, el) => {
        const server = $(el).attr("data-player-url");
        const servertitle = $(el).text().trim();

        servers1.push({
          server,
          servertitle,
        });
      });

    $(".server-buttons .server-btn")
      .slice(7, 12)
      .each((i, el) => {
        const server = $(el).attr("data-player-url");
        const servertitle = $(el).text().trim();

        servers2.push({
          server,
          servertitle,
        });
      });

    const komik = [];
    $(".reader-area img").each((i, el) => {
      const img = $(el).attr("src")?.replace(/^\/\//, "https://");
      const imgId = $(el).attr("img-id");
      komik.push({
        img,
        imgId,
      });
    });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        titleepsode,
        ["public"]: servers1,
        ["private"]: servers2,
        komiks: komik,
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
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.mynimeku.com/",
        Origin: "https://www.mynimeku.com",
        Connection: "keep-alive",
      },
    });

    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Gagal ambil gambar");
  }
});

app.get("/latestseries/page/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/latest-series/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const latestseries = [];
    const nav = [];

    $("article.anime div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
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

      latestseries.push({
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

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        latestseries,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/latestkomik/page/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/latest-komik/page/${page}/`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const latestkomik = [];
    const nav = [];

    $("article.manga div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");
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

      latestkomik.push({
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

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        latestkomik,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/search/*", async (req, res) => {
  const keyword = req.params[0];
  const url = `https://www.mynimeku.com/?s=${keyword}`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const search = [];

    $("article div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find("div.type").text().trim();
      const status = $(element).find("div.status").text().trim();
      const title = $(element).find("div.title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const rating = $(element)
        .find(".score .rtg .clearfix span.ratti")
        .text()
        .trim();

      search.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        rating,
      });
    });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        search,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/popular/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/page/${page}/?title&order=popular&status&type=TV&genre%5B0%5D=action&genre%5B1%5D=adult&genre%5B2%5D=adult-cast&genre%5B3%5D=adventure&genre%5B4%5D=anthropomorphic&genre%5B5%5D=award-winning&genre%5B6%5D=cars&genre%5B7%5D=cgdct&genre%5B8%5D=childcare&genre%5B9%5D=comedy&genre%5B10%5D=crossdressing&genre%5B11%5D=drama&genre%5B12%5D=ecchi&genre%5B13%5D=erotica&genre%5B14%5D=fantasy&genre%5B15%5D=gag-humor&genre%5B16%5D=game&genre%5B17%5D=girls-love&genre%5B18%5D=gore&genre%5B19%5D=gourmet&genre%5B20%5D=harem&genre%5B21%5D=high-stakes-game&genre%5B22%5D=historical&genre%5B23%5D=horror&genre%5B24%5D=idols&genre%5B25%5D=isekai&genre%5B26%5D=josei&genre%5B27%5D=love-polygon&genre%5B28%5D=love-status-quo&genre%5B29%5D=mahou-shoujo&genre%5B30%5D=martial-arts&genre%5B31%5D=mature&genre%5B32%5D=military&genre%5B33%5D=music&genre%5B34%5D=mystery&genre%5B35%5D=mythology&genre%5B36%5D=organized-crime&genre%5B37%5D=otaku-culture&genre%5B38%5D=parody&genre%5B39%5D=performing-arts&genre%5B40%5D=reincarnation&genre%5B41%5D=romance&genre%5B42%5D=samurai&genre%5B43%5D=school&genre%5B44%5D=sci-fi&genre%5B45%5D=seinen&genre%5B46%5D=shounen&genre%5B47%5D=showbiz&genre%5B48%5D=slice-of-life&genre%5B49%5D=space&genre%5B50%5D=sports&genre%5B51%5D=super-power&genre%5B52%5D=supernatural&genre%5B53%5D=survival&genre%5B54%5D=suspense&genre%5B55%5D=time-travel&genre%5B56%5D=urban-fantasy&genre%5B57%5D=vampire&genre%5B58%5D=video-game&genre%5B59%5D=villainess&genre%5B60%5D=workplace`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const popular = [];
    const nav = [];

    $("article div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find("div.type").text().trim();
      const status = $(element).find("div.status").text().trim();
      const title = $(element).find("div.title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const rating = $(element)
        .find(".score .rtg .clearfix span.ratti")
        .text()
        .trim();

      popular.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        rating,
      });
    });

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        popular,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/list/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/page/${page}/?title&order=title&status&type=TV&genre%5B0%5D=action&genre%5B1%5D=adventure&genre%5B2%5D=anthropomorphic&genre%5B3%5D=award-winning&genre%5B4%5D=cars&genre%5B5%5D=cgdct&genre%5B6%5D=childcare&genre%5B7%5D=comedy&genre%5B8%5D=crossdressing&genre%5B9%5D=drama&genre%5B10%5D=fantasy&genre%5B11%5D=gag-humor&genre%5B12%5D=game&genre%5B13%5D=gore&genre%5B14%5D=gourmet&genre%5B15%5D=high-stakes-game&genre%5B16%5D=historical&genre%5B17%5D=horror&genre%5B18%5D=idols&genre%5B19%5D=isekai&genre%5B20%5D=josei&genre%5B21%5D=love-polygon&genre%5B22%5D=love-status-quo&genre%5B23%5D=mahou-shoujo&genre%5B24%5D=martial-arts&genre%5B25%5D=mature&genre%5B26%5D=military&genre%5B27%5D=music&genre%5B28%5D=mystery&genre%5B29%5D=mythology&genre%5B30%5D=organized-crime&genre%5B31%5D=otaku-culture&genre%5B32%5D=parody&genre%5B33%5D=performing-arts&genre%5B34%5D=reincarnation&genre%5B35%5D=romance&genre%5B36%5D=samurai&genre%5B37%5D=school&genre%5B38%5D=sci-fi&genre%5B39%5D=seinen&genre%5B40%5D=shounen&genre%5B41%5D=showbiz&genre%5B42%5D=slice-of-life&genre%5B43%5D=space&genre%5B44%5D=sports&genre%5B45%5D=super-power&genre%5B46%5D=supernatural&genre%5B47%5D=survival&genre%5B48%5D=suspense&genre%5B49%5D=time-travel&genre%5B50%5D=urban-fantasy&genre%5B51%5D=vampire&genre%5B52%5D=video-game&genre%5B53%5D=villainess&genre%5B54%5D=workplace`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const list = [];
    const nav = [];

    $("article div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find("div.type").text().trim();
      const status = $(element).find("div.status").text().trim();
      const title = $(element).find("div.title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const rating = $(element)
        .find(".score .rtg .clearfix span.ratti")
        .text()
        .trim();

      list.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        rating,
      });
    });

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        list,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/ongoing/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/page/${page}/?title&order=title&status=On-Going&type=TV&genre%5B0%5D=action&genre%5B1%5D=adventure&genre%5B2%5D=anthropomorphic&genre%5B3%5D=award-winning&genre%5B4%5D=cars&genre%5B5%5D=cgdct&genre%5B6%5D=childcare&genre%5B7%5D=comedy&genre%5B8%5D=crossdressing&genre%5B9%5D=drama&genre%5B10%5D=ecchi&genre%5B11%5D=fantasy&genre%5B12%5D=gag-humor&genre%5B13%5D=game&genre%5B14%5D=gore&genre%5B15%5D=gourmet&genre%5B16%5D=harem&genre%5B17%5D=high-stakes-game&genre%5B18%5D=historical&genre%5B19%5D=horror&genre%5B20%5D=idols&genre%5B21%5D=isekai&genre%5B22%5D=josei&genre%5B23%5D=love-polygon&genre%5B24%5D=love-status-quo&genre%5B25%5D=mahou-shoujo&genre%5B26%5D=martial-arts&genre%5B27%5D=mature&genre%5B28%5D=military&genre%5B29%5D=music&genre%5B30%5D=mystery&genre%5B31%5D=mythology&genre%5B32%5D=organized-crime&genre%5B33%5D=otaku-culture&genre%5B34%5D=parody&genre%5B35%5D=performing-arts&genre%5B36%5D=reincarnation&genre%5B37%5D=romance&genre%5B38%5D=samurai&genre%5B39%5D=school&genre%5B40%5D=sci-fi&genre%5B41%5D=seinen&genre%5B42%5D=shounen&genre%5B43%5D=showbiz&genre%5B44%5D=slice-of-life&genre%5B45%5D=space&genre%5B46%5D=sports&genre%5B47%5D=super-power&genre%5B48%5D=supernatural&genre%5B49%5D=survival&genre%5B50%5D=suspense&genre%5B51%5D=time-travel&genre%5B52%5D=urban-fantasy&genre%5B53%5D=vampire&genre%5B54%5D=video-game&genre%5B55%5D=villainess&genre%5B56%5D=workplace`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const ongoing = [];
    const nav = [];

    $("article div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find("div.type").text().trim();
      const status = $(element).find("div.status").text().trim();
      const title = $(element).find("div.title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const rating = $(element)
        .find(".score .rtg .clearfix span.ratti")
        .text()
        .trim();

      ongoing.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        rating,
      });
    });

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        ongoing,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

app.get("/movie/*", async (req, res) => {
  const page = req.params[0];
  const url = `https://www.mynimeku.com/full-list/page/${page}/?title&order=title&status&type=Movie`;
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const movie = [];
    const nav = [];

    $("article div.animposx").each((i, element) => {
      const img = $(element).find("img");
      const getposter =
        img.attr("data-lazy-src") || img.attr("data-src") || img.attr("src");
      const poster = getposter?.replace(/^\/\//, "https://");

      const tipe = $(element).find("div.type").text().trim();
      const status = $(element).find("div.status").text().trim();
      const title = $(element).find("div.title").text().trim();
      const href = $(element).find("a").attr("href");
      const slug = href.split("/").filter(Boolean).pop();
      const katslug = new URL(href).pathname.substring(1);
      const rating = $(element)
        .find(".score .rtg .clearfix span.ratti")
        .text()
        .trim();

      movie.push({
        title,
        poster,
        tipe,
        status,
        slug,
        katslug,
        href,
        rating,
      });
    });

    $(".pagination")
      .find("span, a, span.page-numbers")
      .each((i, el) => {
        const page = $(el).text().trim();

        nav.push({
          page,
          active: $(el).hasClass("current"),
        });
      });

    res.json({
      status: "success",
      pembuat: "GAZZ AHAY",
      statusCode: 200,
      statusMessage: "Aman cuy",
      data: {
        movie,
        nav,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

const getDetail = async (type, slug) => {
  try {
    const url = `https://www.mynimeku.com/${type}/${slug}/`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const poster = $("div.infoanime img")
      .attr("data-lazy-src")
      ?.replace(/^\/\//, "https://");

    const title = $("div.infox h1.entry-title").text().trim();
    const rating = $("div.rating-area .rtg i").first().text().trim();
    const description = $("div.desc .entry-content p").first().text().trim();

    const genre = [];
    $("div.genre-info a").each((i, el) => {
      genre.push($(el).text().trim());
    });

    const info = {};
    $("div.infox .spe span").each((i, el) => {
      const label = $(el).find("b").text().trim();
      const value = $(el).clone().children("b").remove().end().text().trim();
      info[label] = value;
    });

    const heading = $("div.animetitle-episode span").text().trim();

    const list = [];

    $(".eps-wrapper, .chap-wrapper").each((i, el) => {
      const title = $(el)
        .find(".epsleft .lchx a")
        .clone()
        .children("span")
        .remove()
        .end()
        .text()
        .trim();

      const href = $(el).find(".epsleft .lchx a").attr("href");

      if (!href) return;

      list.push({
        title,
        href,
        id: href.split("/").filter(Boolean).pop(),
      });
    });

    return {
      detail: {
        poster,
        title,
        rating,
        genre,
        description,
        info,
        heading,
        list,
      },
    };
  } catch (err) {
    return {
      detail: null,
    };
  }
};

app.get("/banner", async (req, res) => {
  const url = `https://www.mynimeku.com/full-list/?title=&order=update&status=On-Going&type=TV`;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.google.com/",
        Origin: "https://www.google.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    const elements = $("article div.animposx").slice(0, 4);

    const banner = await Promise.all(
      elements
        .map(async (i, element) => {
          const img = $(element).find("img");
          const getposter =
            img.attr("data-lazy-src") ||
            img.attr("data-src") ||
            img.attr("src");

          const poster = getposter?.replace(/^\/\//, "https://");

          const tipe = $(element).find("div.type").text().trim();
          const status = $(element).find("div.status").text().trim();
          const title = $(element).find("div.title").text().trim();
          const href = $(element).find("a").attr("href");

          if (!href) return null;

          const slug = href.split("/").filter(Boolean).pop();
          const katslug = new URL(href).pathname.substring(1);

          const rating = $(element)
            .find(".score .rtg .clearfix span.ratti")
            .text()
            .trim();

          // 🔥 ambil detail (INI YANG BIKIN ERROR TADI)
          const detail = await getDetail(tipe.toLowerCase(), slug);

          return {
            title,
            poster,
            tipe,
            status,
            slug,
            katslug,
            href,
            rating,

            // 🔥 gabung semua data detail
            ...detail.detail,
          };
        })
        .get(),
    );

    // bersihin null
    const cleanBanner = banner.filter((item) => item !== null);

    res.json({
      status: "success",
      data: {
        banner: cleanBanner,
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
