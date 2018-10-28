const Discord = require('discord.js')
const snekfetch = require('snekfetch')
const client = new Discord.Client()
const RichEmbed = Discord.RichEmbed

client.on('ready', () => {
  console.log(`Logado como ${client.user.tag}!`)
})

client.on('message', async msg => {
  if (msg.content.startsWith(`<@${client.user.id}>`)) {
    console.log(`"${msg.content}" executado por "${msg.author.tag}" (${msg.author.id}) no servidor "${msg.guild.name}" (${msg.guild.id})`)
    msg.channel.startTyping()
    const where = msg.content.split(' ')[1] || 'br'
    try {
      const { body } = await snekfetch.get(`https://s.glbimg.com/jo/el/2018/apuracao/2-turno/${where}/executivo.json`)

      const info = new RichEmbed()
        .setTitle(`${body.abrangencia.nome} (${body.abrangencia.andamento}%)`)
        .setDescription([
          `**${body.abrangencia.votos.validos.quantidade}** (${body.abrangencia.votos.validos.porcentagem}%) votos válidos`,
          `**${body.abrangencia.votos.brancos.quantidade}** (${body.abrangencia.votos.brancos.porcentagem}%) votos brancos`,
          `**${body.abrangencia.votos.nulos.quantidade}** (${body.abrangencia.votos.nulos.porcentagem}%) votos nulos`,
          `**${body.abrangencia.votos.abstencao.quantidade}** (${body.abrangencia.votos.abstencao.porcentagem}%) abstenções`,
          ``,
          ` ${process.env.BOT_TAG_EMOJI} [Adicione o **Apuração Bot** ao seu servidor](https://discordapp.com/oauth2/authorize?client_id=506142008415485963&scope=bot)`,
          ` ${process.env.GITHUB_EMOJI} [Veja o código-fonte no GitHub](https://github.com/pedrofracassi/apuracao-bot)`
        ].join('\n'))
        .setColor(0x7289da)
      await msg.channel.send(info)

      body.candidatos.forEach(async candidato => {
        const embed = new RichEmbed()
          .setAuthor(`${candidato.nome} (${candidato.partido})`, candidato.foto, candidato.politicoUrl)
          .setDescription(`**${candidato.votos.quantidade} votos** (${candidato.votos.porcentagem}%)`)
        await msg.channel.send(embed)
      })

    } catch (e) {
      if (e.message === '404 Not Found') {
        msg.channel.send(new RichEmbed().setColor(0xF05958).setDescription('**UF não encontrada.** Verifique se você digitou corretamente.'))
        console.log(e)
      } else {
        msg.channel.send(new RichEmbed().setColor(0xF05958).setDescription([
          '**Um erro ocorreu.** [Clique aqui para reportar ao desenvolvedor.](https://github.com/pedrofracassi/apuracao-bot/issues/new)',
          '\`' + e.message +'\`'
        ].join('\n')))
        console.log(e)
      }
    }
    msg.channel.stopTyping()
  }
})

client.login(process.env.DISCORD_TOKEN)