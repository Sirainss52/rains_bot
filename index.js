const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const Canvas = require("canvas");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Pastikan diawali dengan 'rains'
  if (!message.content.toLowerCase().startsWith("rains")) return;

  const args = message.content.split(" ");
  const command = args[1]?.toLowerCase();

  if (!command) {
    return message.reply(
      "⚠️ Format: `rains <command>`\nCoba `rains help` untuk lihat daftar command."
    );
  }

  // === rains slap ===
  if (command === "slap") {
    const target = message.mentions.users.first();
    if (!target)
      return message.reply("👋 Tag seseorang dulu, contoh: `rains slap @user`");

    try {
      const res = await axios.get("https://nekos.best/api/v2/slap");
      const gif = res.data.results[0].url;

      message.channel.send({
        content: `😤 ${message.author.username} menampar ${target.toString()}!`,
        files: [gif],
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ Gagal ambil GIF slap 😅");
    }
    return;
  }

  // === rains meme ===
  if (command === "meme") {
    try {
      const res = await axios.get("https://meme-api.com/gimme");
      const meme = res.data;
	  console.log('meme:',meme);
		
      message.channel.send({
        content: `**${meme.title}**\nMeme Links: ${meme.postLink}`,
        files: [meme.url],
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ Gagal ambil meme 😅");
    }
    return;
  }

  // === rains joke ===
  if (command === "joke") {
    try {
      const res = await axios.get(
        "https://candaan-api.vercel.app/api/text/random"
      );
      const joke = res.data.data;
      message.reply(`🤣 ${joke}`);
    } catch (error) {
      console.error("Error fetching joke:", error);
      message.reply("⚠️ Gagal mengambil joke.");
    }
    return;
  }

  // === rains profile ===
  if (command === "profile") {
    const user = message.author;
    const member = message.guild.members.cache.get(user.id);
	console.log('user:',user);
	
    const canvas = Canvas.createCanvas(600, 250);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#2b2d31";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const avatar = await Canvas.loadImage(
      user.displayAvatarURL({ extension: "png", size: 256 })
    );
    ctx.save();
    ctx.beginPath();
    ctx.arc(125, 125, 80, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 45, 45, 160, 160);
    ctx.restore();

    ctx.font = "bold 28px Sans";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(user.username, 230, 100);

    const role = member.roles.highest.name;
    ctx.font = "22px Sans";
    ctx.fillStyle = "#a0a0a0";
    ctx.fillText(`Role: ${role}`, 230, 150);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), {
      name: "profile.png",
    });
    message.reply({ files: [attachment] });
    return;
  }

  // === rains signal ===
  if (command === "signal") {
    try {
      const res = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 15,
            page: 1,
          },
        }
      );

      const coins = res.data;
      const bullish = coins.filter(
        (coin) => coin.price_change_percentage_24h > 2
      );
      const bearish = coins.filter(
        (coin) => coin.price_change_percentage_24h < -2
      );

      let reply =
        "📊 **Signal Rains - Market Overview**\n─────────────────────────────\n";

      reply += "📈 **Bullish Coins**\n";
      if (bullish.length === 0) {
        reply += "Tidak ada coin yang bullish saat ini.\n";
      } else {
        bullish.forEach((coin) => {
          const price = coin.current_price;
          reply += `💎 **${coin.name} (${coin.symbol.toUpperCase()})**\nEntry: $${price.toFixed(
            2
          )} | Exit: $${(price * 1.05).toFixed(
            2
          )} | Stop Loss: $${(price * 0.97).toFixed(2)}\n\n`;
        });
      }

      reply += "─────────────────────────────\n";

      reply += "📉 **Bearish Coins**\n";
      if (bearish.length === 0) {
        reply += "Tidak ada coin yang bearish saat ini.\n";
      } else {
        bearish.forEach((coin) => {
          const price = coin.current_price;
          reply += `🔻 **${coin.name} (${coin.symbol.toUpperCase()})**\nEntry: $${price.toFixed(
            2
          )} | Exit: $${(price * 0.97).toFixed(
            2
          )} | Stop Loss: $${(price * 1.05).toFixed(2)}\n\n`;
        });
      }

      reply +=
        "─────────────────────────────\n💬 *Gunakan sinyal ini dengan bijak ya 😅*";

      message.reply(reply);
    } catch (err) {
      console.error(err);
      message.reply("❌ Gagal mengambil data dari CoinGecko.");
    }
    return;
  }

  // === rains kiss ===
if (command === "kiss") {
  const target = message.mentions.users.first();
  if (!target) {
    return message.reply("😘 Tag seseorang dulu, contoh: `rains kiss @user`");
  }

  try {
    const res = await axios.get("https://nekos.best/api/v2/kiss");
    const gif = res.data.results[0].url;

    message.channel.send({
      content: `💋 ${message.author.username} mencium ${target.username}!`,
      files: [gif],
    });
  } catch (err) {
    console.error(err);
    message.reply("❌ Gagal ambil GIF kiss 😅");
  }
}

// === rains hug ===
if (command === "hug") {
  const target = message.mentions.users.first();
  if (!target) {
    return message.reply("🤗 Tag seseorang dulu, contoh: `rains hug @user`");
  }

  try {
    const res = await axios.get("https://nekos.best/api/v2/hug");
    const gif = res.data.results[0].url;

    message.channel.send({
      content: `🤗 ${message.author.username} memeluk ${target.toString()}!`,
      files: [gif],
    });
  } catch (err) {
    console.error(err);
    message.reply("❌ Gagal ambil GIF hug 😅");
  }
}

  // === rains coin <symbol> ===
  if (command === "coin") {
    const coin = args[2]?.toLowerCase();
    if (!coin) {
      return message.reply(
        "⚠️ Format: `rains coin <symbol>` contoh: `rains coin btc`"
      );
    }

    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin}`
      );
      const data = res.data;
      const price = data.market_data.current_price.usd;
      const change = data.market_data.price_change_percentage_24h.toFixed(2);
      const trendEmoji = change >= 0 ? "📈" : "📉";

      message.reply(
        `📊 **${data.name} (${data.symbol.toUpperCase()})**\n💰 Harga: $${price.toLocaleString()}\n${trendEmoji} Perubahan 24 jam: ${change}%`
      );
    } catch (err) {
      message.reply("❌ Coin tidak ditemukan atau API error.");
      console.error(err.message);
    }
    return;
  }

  // === rains semangat ===
  if (command === "semangat" || command === "support") {
    const target = message.mentions.users.first();
    if (!target) {
      return message.reply(
        "💬 Tag teman kamu dulu dong! Contoh: `rains semangat @user`"
      );
    }

    const motivasi = [
      "Jangan menyerah, kamu pasti bisa! 💪",
      "Kamu lebih kuat dari yang kamu kira 🔥",
      "Semangat terus ya, semua akan baik-baik saja 🌈",
      "Percaya diri! Langkah kecilmu berarti besar 💫",
      "Teruskan perjuanganmu, hasil nggak akan mengkhianati usaha 💎",
      "Kamu nggak sendirian, kami dukung kamu! 🤗",
      "Ayo bangkit lagi, masih banyak hal keren menunggumu 🚀",
      "Senyum dulu, biar harimu makin cerah 😄",
      "Kamu inspirasi buat banyak orang 💖",
      "Capek boleh, tapi jangan nyerah ya 🌻",
    ];

    const pesan = motivasi[Math.floor(Math.random() * motivasi.length)];

    try {
      // Ambil GIF random dari Nekos.best (misalnya "pat" biar terasa suportif)
      const res = await axios.get("https://nekos.best/api/v2/pat");
      const gif = res.data.results[0].url;

      message.channel.send({
        content: `💬 ${message.author.username} memberi semangat ke ${target.toString()}!\n> ${pesan}`,
        files: [gif],
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ Gagal mengambil GIF semangat 😅");
    }
  }

  // === rains pat ===
  if (command === "pat") {
    const target = message.mentions.users.first();
    if (!target) {
      return message.reply(
        "🫶 Tag seseorang dulu dong! Contoh: `rains pat @user`"
      );
    }

    try {
      const res = await axios.get("https://nekos.best/api/v2/pat");
      const gif = res.data.results[0].url;

      message.channel.send({
        content: `🫶 ${message.author.username} mengelus kepala ${target.toString()}! dengan lembut~ 😽`,
        files: [gif],
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ Gagal ambil GIF pat 😅");
    }
  }

  // === rains help ===
  if (command === "help") {
    message.reply(
      `🛠️ **Daftar Command Rains Bot:**\n\n` +
        `💰 \`rains coin <symbol>\` → Lihat harga coin (misal: rains coin btc) (🛠️ Masih tahap dev)\n` +
        `📈 \`rains signal\` → Lihat coin bullish/bearish (🛠️ Masih tahap dev)\n` +
        `🖐️ \`rains slap @user\` → Tampar seseorang\n` +
        `🤗 \`rains hug @user\` → peluk seseorang\n` +
        `💪 \`rains semangat @user\` → beri semangat kepada seseorang\n` +
        `💋 \`rains kiss @user\` → cium seseorang\n` +
        `🤣 \`rains meme\` → Ambil meme random\n` +
        `😂 \`rains joke\` → Candaan random\n` +
        `👤 \`rains profile\` → Lihat profil kamu\n`+
        `\n*Bot ini masih tahap pengembangan, mohon maklum jika ada fitur yang belum sempurna ya 😅*`+
        `\n *made with love ❤️ by ghanni*`
    );
    return;
  }
});

client.login(process.env.TOKEN);
