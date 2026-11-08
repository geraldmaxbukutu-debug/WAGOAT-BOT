module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "commands"],
    version: "2.0.0",
    author: "Gerald", // original author Romeo
    countDown: 3,
    role: 0,
    shortDescription: "Interactive command menu & details",
    longDescription: "Displays an organized, xmd-style dashboard of all available bot commands or detailed information for a specific command.",
    category: "system",
    guide: { en: "{pn}help [command name]" }
  },

  onStart: async ({ api, event, args, message, prefix }) => {
    const cmds = global.GoatBot.cmds;
    const botName = global.GoatBot.config.botName || "MATEO AI";
    const footer = `╭───────────────◆\n│ 🤖 ${botName}\n│ ⚡ Made by Gerald\n╰───────────────◆`;

    // ─── 1. SPECIFIC COMMAND INFO VIEW ───
    if (args[0]) {
      const query = args[0].toLowerCase().replace(prefix, "");
      const cmd = cmds.get(query) || Array.from(cmds.values()).find(c => c.config.aliases && c.config.aliases.includes(query));
      
      if (!cmd) {
        return message.reply(`❌ **Error:** Command or alias "${query}" could not be found.`);
      }

      const c = cmd.config;
      const guide = (c.guide && (c.guide.en || Object.values(c.guide)[0])) || "";
      const pn = prefix + c.name;
      const guideText = guide.replace(/\{pn\}/gi, pn);
      const aliasesText = c.aliases && c.aliases.length > 0 ? c.aliases.join(", ") : "None";
      const roleText = c.role === 1 ? "🛡️ Admin Only" : c.role === 2 ? "👑 Bot Owner" : "👤 Everyone";

      const details = 
        `┏━━━ 🧩 **COMMAND INFO** ━━━┓\n` +
        `┃\n` +
        `┃ 📌 **Name:** \`${pn}\`\n` +
        `┃ 📂 **Category:** \`${c.category || "misc"}\`\n` +
        `┃ 🔤 **Aliases:** \`${aliasesText}\`\n` +
        `┃ ⏱️ **Cooldown:** \`${c.countDown || 0}s\`\n` +
        `┃ 🔒 **Access:** ${roleText}\n` +
        `┃ 🏷️ **Version:** \`${c.version || "1.0.0"}\`\n` +
        `┃ ✍️ **Author:** \`${c.author || "Unknown"}\`\n` +
        `┃\n` +
        `┣━━━ 📝 **DESCRIPTION** ━━━┫\n` +
        `┃ ${c.longDescription || c.shortDescription || "No description provided."}\n` +
        (guideText ? `┃\n┣━━━ 📖 **USAGE** ━━━┫\n┃ \`${guideText}\`\n` : "") +
        `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
        footer;

      return message.reply(details);
    }

    // ─── 2. FULL MENU & CATEGORY GROUPING VIEW ───
    const grouped = {};
    for (const [name, cmd] of cmds) {
      const cat = (cmd.config.category || "misc").toLowerCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(`\`${prefix}${cmd.config.name}\``);
    }

    // Category icons mapping for that xmd feel
    const categoryIcons = {
      system: "⚙️",
      admin: "🛡️",
      box: "👥",
      group: "👥",
      media: "🎬",
      download: "📥",
      ai: "🧠",
      game: "🎮",
      fun: "✨",
      tools: "🛠️",
      misc: "📦"
    };

    let menuText = 
      `╭━━━ 🌌 **${botName.toUpperCase()} DASHBOARD** 🌌 ━━━╮\n` +
      `┃\n` +
      `┃ 📌 **Prefix:** \`${prefix}\`\n` +
      `┃ 📊 **Total Commands:** \`${cmds.size}\`\n` +
      `┃ ⏳ **Active Status:** Online\n` +
      `┃\n` +
      `┣━━━━━━━━━━━━━━━━━━━━━━━┫\n`;

    for (const [cat, list] of Object.entries(grouped)) {
      const icon = categoryIcons[cat] || "📁";
      menuText += `┃ ${icon} **${cat.toUpperCase()}** [${list.length}]\n`;
      menuText += `┃ ${list.join(", ")}\n` + `┃\n`;
    }

    menuText += 
      `┣━━━━━━━━━━━━━━━━━━━━━━━┫\n` +
      `┃ 💡 *Tip: Type \`${prefix}help [cmd]\` for info.*\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
      footer;

    return message.reply(menuText);
  }
};
