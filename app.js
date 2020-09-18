// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

var express = require('express')
var app = express();
var http = require('https');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the `public` directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', (request, response) => {
    // ejs render automatically looks in the views folder
    response.render('index');
});

app.listen(port, () => {
    // will echo 'Our app is running on http://localhost:5000 when run locally'
    console.log('Our app is running on http://localhost:' + port);
});

/*setInterval(() => {
  http.get('https://hidden-fjord-17967.herokuapp.com/');
}, 900000);*/


var conString = config.dbconn;


var pg = require('pg');
//var pool = new pg.Pool(conString);


//var pgclient = new pg.Client(conString);


client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`ProBot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`to pouli mou on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('messageReactionAdd', (reaction, user) => {
    onReactionEvent(reaction);
});

client.on('messageReactionRemove', (reaction, user) => {
    onReactionEvent(reaction);
});

client.on("message", function(message){
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === 'alekos')
	  message.channel.send("alekowz");
  
  if(command === "tv_poster") {
    // Get imdb score for args[1]
   // const m = await message.channel.send("Ping?");
   // m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  // try
  // {
	   const query = args.join(" ");
		
		getTvShow(query, function(tvObj)
		{
			if(tvObj == null)
				message.channel.send("Mathe onomata seiron kathister!");
			else
				message.channel.send("https://image.tmdb.org/t/p/w640" + tvObj.poster_path);
		});
   //}
   //catch(e)
  // {
	//   message.channel.send("Error kathister: ", e.message);
  // }
  }
  
  if(command === "tv_description") {
    // Get imdb score for args[1]
   // const m = await message.channel.send("Ping?");
   // m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  // try
  // {
	   //var url = 'https://api.themoviedb.org/3/search/tv?api_key=0390a02f871031ab64e5716275c2d061&query=';
		
		const query = args.join(" ");
		
		getTvShow(query, function(tvObj)
		{
			if(tvObj == null)
				message.channel.send("Mathe onomata seiron kathister!");
			else
				message.channel.send(query + ": " + tvObj.overview);
		});
		
		//var http = require('https');
		
		/*http.get(url + query, function(res){
			var body = '';

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(){
				var fbResponse = JSON.parse(body);
				console.log("Got a response: ", fbResponse[0]);
				
				if(fbResponse == null || fbResponse.results == null ||fbResponse.results.length == 0)
					message.channel.send("Mathe onomata seiron kathister!");
				else
					message.channel.send(query + ": " + fbResponse.results[0].overview);
			});

		}).on('error', function(e){
		  console.log("Got an error: ", e);
		});*/
		
   //}
   //catch(e)
  // {
	//   message.channel.send("Error kathister: ", e.message);
  // }
  }
  
  if(command === "tv_ratings") {
	  
//	pool.connect();
	
	var sql = "select utsr.user, utsr.rating, utsr.tvshowid from public.usertvshowratings as utsr inner join public.tvshows ts on ts.id = utsr.tvshowid where ts.name = lower('" + args.join(" ") + "')"; 
	
	pg.connect(conString, function (err, client, done) {
	  if (err) {
		return console.error('error fetching client from pool', err)
	  }
	  client.query(sql,  function (err, result) {
		done()
		
		var msg = "";
		
		if (err) {
		  return console.error('error happened during query', err)
		}
		
		for (var i = 0; i < result.rows.length; i++) {
			
			var row = result.rows[i];
				
			msg = msg + "\n" + row.user + ": " + row.rating;
		}
		
		message.channel.send(msg);
	  });
	});
  }
	if(command === "tv_rate") {
	
		const rate = args.shift();
		
		const showName = args.join(" ");
		
		if(rate === "help")
		{
			message.channel.send("rate_tv rating tvshow \nExample: rate_tv 1 Band of Brothers");
			return;
		}
		
		getTvShow(showName, function(tvObj)
		{
			if(tvObj == null)
				message.channel.send("Mathe onomata seiron kathister!");
			else
			{
				
				var sql = "INSERT INTO usertvshowratings(tvshowid, rating, \"user\") VALUES ((select ts.id from public.tvshows ts where ts.name = lower('" + showName + "')), "+ rate + ",'" + message.author.username + "')ON CONFLICT on constraint showrating_pk  DO UPDATE SET rating = " + rate;
				
				pg.connect(conString, function (err, client, done) {
				  if (err) {
					return console.error('error fetching client from pool', err)
				  }
				  client.query(sql,  function (err, result) {
					done()
					
					var msg = "";
					
					if (err) {
					  return message.channel.send("Please add movie first or kathister developer ton paizei WutFace .\nType tv_rate help for more info");
					}
					
					 message.channel.send("Rating added! PogChamp");
				  });
				});
			}
		});
		
	}
	
	if(command === "tv_list") {
	
		var sql = "select name from tvshows";
		
		pg.connect(conString, function (err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err)
			}
			client.query(sql,  function (err, result) {
				done()
			
				var msg = "";
				
				for (var i = 0; i < result.rows.length; i++) {
				
					var row = result.rows[i];
					msg = msg + "\n" + row.name;
				}
			
				message.channel.send(msg);
			});
		});
	}
	
	if(command === "tv_myratings") {
	
		var sql = "select utsr.rating, ts.name from public.usertvshowratings as utsr inner join public.tvshows ts on ts.id = utsr.tvshowid where utsr.user = '" + message.author.username + "'"; 
		
		pg.connect(conString, function (err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err)
			}
			client.query(sql,  function (err, result) {
				done()
			
				var msg = "";
				
				for (var i = 0; i < result.rows.length; i++) {
				
					var row = result.rows[i];
					msg = msg + "\n" + row.name + ": " + row.rating;
				}
			
				message.channel.send(msg);
			});
		});
	}
	
	if(command === "tv_add") {
	
		const showName = args.join(" ");
	
		if(showName === "help")
		{
			message.channel.send("add_tv tvshow \nExample: add_tv Oti na ne");
			return;
		}
		
		getTvShow(showName, function(tvObj)
		{
			if(tvObj == null)
				message.channel.send("Mathe onomata seiron kathister!");
			else
			{
				
				const year = tvObj.first_air_date.split("-")[0];
				
				var sql = "INSERT INTO tvshows(year, name) VALUES (" + year + ", lower('" + args.join(" ") + "'))";
				
				pg.connect(conString, function (err, client, done) {
				  if (err) {
					return console.error('error fetching client from pool', err)
				  }
				  client.query(sql,  function (err, result) {
					done()
					
					var msg = "";
					
					if (err) {
					  message.channel.send("Movie already exists i kathister developer.\nType tv_add help for more info");
					  return console.error('error happened during query', err)
					}
					
					 message.channel.send("Movie added! CoolStoryBob");
				  });
				});
			}
		});
	}
	/*pool.connect(conString, function (err, client, done) {
	  if (err) {
		return console.error('error fetching client from pool', err)
	  }
	  client.query(sql,  function (err, result) {
		done()
		
		var msg = "";
		
		if (err) {
		  return console.error('error happened during query', err)
		}
		
		for (var i = 0; i < result.rows.length; i++) {
			
			var row = result.rows[i];
				
			console.log(row);	
			
			msg = msg + "\n" + row.user + ": " + row.rating;
		}
		
		message.channel.send(msg);
	  });
	  
	  pool.end();*/
	
	/*var query = pool.query(sql);
	
	var msg = "";
	
	query.on('row', function(row) {
		msg = msg + "\n" + row.user + ": " + row.rating;
	});

	query.on('end', function() {
		message.channel.send(msg);
		pgclient.end();
	});*/
	
  if(command === "reddit_hot") {
    // Get imdb score for args[1]
   // const m = await message.channel.send("Ping?");
   // m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  // try
  // {
	   var url = 'https://www.reddit.com/r/' + args.join(" ") + '/hot/.json?limit=3';
		
		//var http = require('https');
		
		http.get(url, function(res){
			var body = '';

			res.on('data', function(chunk){
				body += chunk;
			});

			res.on('end', function(){
				var fbResponse = JSON.parse(body);
				
				if(fbResponse == null || fbResponse.data == null ||fbResponse.data.children == 0)
					message.channel.send("Mathe onomata subredit kathister!");
				else
				{
					for (var i = 0; i < fbResponse.data.children.length; i++) {
    
						var reddit = fbResponse.data.children[i].data;
						
						if(reddit.stickied == 'true' || reddit.stickied)
							continue;
						
						/*var embed = {embed: {
							color: 3447003,
							title: reddit.title,
							url: "http://www.reddit.com" + reddit.permalink,
							thumbnail: {
								url:reddit.thumbnail
							}
							,fields: [
							  {
								name: "Score",
								value: reddit.score
							  }
							],
							timestamp: new Date(),
							footer: {
							  icon_url: client.user.avatarURL,
							  text: "© ProBot"
							}
						}};*/

						message.channel.send("http://www.reddit.com" + reddit.permalink);
					};
				}
			});

		}).on('error', function(e){
		  console.log("Got an error: ", e);
		});
   //}
   //catch(e)
  // {
	//   message.channel.send("Error kathister: ", e.message);
  // }
  }
  
  /*if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the kick!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Please indicate a reason for the ban!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }*/
});

client.login(config.token);

function onReactionEvent(reaction)
{
    const message = reaction.message;
    
    var thumbsups = message.reactions.find(reaction => reaction.emoji.name === '👍');
    var thumbdowns = message.reactions.find(reaction => reaction.emoji.name === '👎');
    
    var thumbsupsCount = 0;
    var thumbsdownsCount = 0;
    
    if(thumbsups != null)
        thumbsupsCount = thumbsups.count;
    
    if(thumbdowns != null)
        thumbsdownsCount = thumbdowns.count;
    
    //museum id 373458791426949120
    //quotes id 373458867721469982
    
    if(thumbsupsCount - thumbsdownsCount > 1)
    {
        client.channels.get("373458867721469982").send({embed: {
              author: {
                name: `${message.author.username} said:`,
                icon_url: message.author.avatarURL ? message.author.avatarURL : undefined
              },
              description: message.content
         }});
    }
    else if(thumbsdownsCount - thumbsupsCount > 1)
    {
        client.channels.get("373458791426949120").send({embed: {
              author: {
                name: `${message.author.username} said:`,
                icon_url: message.author.avatarURL ? message.author.avatarURL : undefined
              },
              description: message.content
         }});
    }
    
   // message.channel.send("Thumbs up count: " + thumbsupsCount);
   // message.channel.send("Thumbs down count: " + thumbsdownsCount);
}

function getTvShow(name, callback)
{
	var url = 'https://api.themoviedb.org/3/search/tv?api_key=0390a02f871031ab64e5716275c2d061&query=';
	
	//var http = require('https');
	
	var tvObj = null;
	
	http.get(url + name, function(res){
		var body = '';

		res.on('data', function(chunk){
			body += chunk;
		});

		res.on('end', function(){
			
			var fbResponse = JSON.parse(body);
			
			if(fbResponse != null && fbResponse.results != null && fbResponse.results.length > 0)
				tvObj = fbResponse.results[0];
			
			return callback(tvObj);
		});

	}).on('error', function(e){
	  console.log("Got an error: ", e);
	  return callback(tvObj);
	});
}          