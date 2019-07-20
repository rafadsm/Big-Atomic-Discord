const Discord = require('discord.js');
const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const bodyParser = require("body-parser");
const SourceQuery = require('sourcequery');

const app = express()
const client = new Discord.Client();
var sq = new SourceQuery(1500);

const prefix = '!';

const port = process.env.PORT || 8080
const TOKEN = process.env.BOT_TOKEN || ''
const RUST_IP = process.env.RUST_IP;
const RUST_PORT = process.env.RUST_PORT;

const OnlineStr = "Players Online";
const OfflineStr = "Offline";

const TermosMessage = "```Você concorda com os termos? Responda reagindo abaixo para ter acesso ao discord.```";

function Check(token)
{
    return token == TOKEN;
}

function GetMyGuild()
{
    return client.guilds.first();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', serveStatic(__dirname))


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/check', function (req, res) {

    var _token = req.query.token
        var error = Check(_token) ? 0 : -1

    var users = []
    if(error == 0)
        GetMyGuild().members.array()
        .filter(x => x.user.id != client.user.id)
        .forEach(function(item) {
            users.push({id: item.user.id, display: item.displayName, tag: item.user.discriminator, username: item.user.username})
        });

    var channels = []
    if(error == 0)
        GetMyGuild().channels
        .filter(c => c.type == 'text')
        .forEach(c => {
            channels.push({id: c.id, name: c.name})
        })

    var result = {
        error,
        users,
        channels
    }
    res.send(result);

    //return res.sendStatus(200)
});


app.post('/send', bodyParser.json(), function (req, res) {

    var _token = req.body.token
    var valid = Check(_token)

    if(valid)
    {
        var channelid = req.body.channel
        var message = req.body.message

        var type = req.body.type

        var channel = GetMyGuild().channels.get(channelid)
        channel.send(message).then((msg)=>{
            if(type == 1)
                msg.react("👍");
            else if(type == 2)
            {
                msg.react("👍");
                setTimeout(() => {
                    msg.react('👎');
                }, 500);
            }
        })

    }

});



app.listen(port)
client.login(TOKEN);

console.log('listening on port: ' + port)


client.on('ready', () => {
    console.log(`Conectado como ${client.user.tag}!`);
    client.user.setStatus('dnd');

    const cntwo = client.channels.find(cn => cn.id == 514455704686428161);

    cntwo.fetchMessages({limit: 100}).then(messages => messages.forEach(x => {
        if(x.content == TermosMessage)
        x.delete();
    }));

    cntwo.send(TermosMessage).then(msg =>{
        msg.react('👍');
        setTimeout(() => msg.react('👎'), 500);
    });

    try{
        sq.open(RUST_IP, RUST_PORT);
    
        sq.getInfo(function(err, info){
            if (err)
            {
                client.user.setActivity(OfflineStr, { type: 'PLAYING' });
            }
            else
                client.user.setActivity(`${info.players} ${OnlineStr}`, {type: 'WATCHING'});
                sq.close();
            });
            
    }
    catch(ex)
    {
        client.user.setActivity(OfflineStr, {type: 'PLAYING'});
    }
});



client.on('message', message => {

    const user = message.member;
    const author = message.author;
    const channel = message.channel;
    
    if (author.bot) return;

    if (message.isMentioned(client.user)) {
        
        if(isAdmin)
        {
            message.react("👍");
            return;
        }
        message.reply('Sou apenas um bot, não tenho capacidade para continuar esta conversa.').then(function(msg){
            msg.react("👍");
            message.react("👎");
        });

        return;
    }
    
    if(!channel.name)
    {
        message.reply('Sou apenas um bot, não tenho capacidade para continuar esta conversa.').then(function(msg){
            msg.react("👍");
            message.react("👎");
        });
        return;
    }

    if(message.content[0] != prefix || message.content[1] == ' ')
        return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const isAdmin = message.member.hasPermission("ADMINISTRATOR");

    switch(command)
    {
        case 'sayr':
        {
            if(!isAdmin)
                return;

            message.delete();
            channel.send(args.join(' ')).then(function(msg){
                msg.react("👍");
            });
        }
        break;

        case 'say':
        {
            if(!isAdmin)
                return;

            
            channel.send(args.join(' ')).then(function(msg){
                message.delete();
            });
        }
        break;

        case 'prune':
        {
            if(!isAdmin)
                return;

            channel.fetchMessages({limit: 100}).then(messages => channel.bulkDelete(messages));
        }
        break;

        case 'vote':
        {
            if (!isAdmin)
                return;

            message.delete();
            channel.send(args.join(' ')).then(function (msg) {
                msg.react("👍");
                setTimeout(() => {
                    msg.react('👎');
                }, 500);
            });
        }
        break;
    }
});

client.on("guildMemberAdd", (member) => {
    const cntwo = client.channels.find(cn => cn.id == 514534673712676865);
    cntwo.send(member.user + " Seja bem vindo, para ter acesso ao discord, vá até <#514455704686428161> e aceite os termos!");
});

client.on('messageReactionAdd', (reaction, user) => {

    if(user.bot)
        return;
        
    if(reaction.message.content == TermosMessage) {

        const member = GetMyGuild().members.find(m => m.id == user.id)

        if(member.hasPermission("ADMINISTRATOR"))
            return;

        if(reaction.emoji.name == '👍')
        {
            let role = GetMyGuild().roles.find(r => r.name === "Membro");

            member.addRole(role);

            user.send("Agora você faz parte de nosso discord!\nTome cuidado para não ser expulso.");
        }
        if(reaction.emoji.name == '👎')
        {
            user.send("Você não concordou com os termos, sinto muito, você não é bem-vindo aqui!");
            setTimeout(() => member.kick(), 500);
        }
    }
});


var interv = setInterval(()=>{
    try{
        sq.open(RUST_IP, RUST_PORT);
        sq.getInfo(function(err, info){
            
            if (err) {
                client.user.setActivity(OfflineStr, { type: 'PLAYING' });
            }
            else
				client.user.setActivity(`${info.players} ${OnlineStr}`, {type: 'WATCHING'});
            //client.user.setPresence()
            sq.close();
        });
        
    }
    catch(ex)
    {
        client.user.setActivity(OfflineStr, {type: 'PLAYING'});
    }
}, 5000);



function ShutdownBotServer()
{
    clearInterval(interv);

    client.destroy();
    process.exit(0);
}

[`exit`, 'SIGINT', `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, ShutdownBotServer);
});