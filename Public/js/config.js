let token, channelId, userId, clientId;
var options = []
let theme = "";
// so we don't have to write this out everytime 
const twitch = window.Twitch ? window.Twitch.ext : null

// onContext callback called when context of an extension is fired 
twitch.onContext((context) => {
  theme = context.theme;
  twitch.rig.log(context);

  //if theme is darkmode
  if(theme === "dark" ? true : false){
    //if body is light in darkmode
    if($("#bodyExtension")[0]){
        $("#bodyExtension").prop('id', `bodyExtensionDark`)
    }
}else{
    //if body is dark in lightmode
    if($("#bodyExtensionDark")[0]){
        $("#bodyExtensionDark").prop('id', `bodyExtension`)
    }
}
});

// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
  // save our credentials
  token = auth.token;
  channelId = auth.channelId;
  clientId = auth.clientId;
  userId = auth.userId;
});

// when the config changes, update the panel! 
twitch.configuration.onChanged(() => {
  twitch.rig.log(twitch.configuration.broadcaster)

  if (twitch.configuration.broadcaster.content == null) {
    twitch.configuration.broadcaster.content = '[]'
  }

  if(twitch.configuration.broadcaster){
    try{
      var config = JSON.parse(twitch.configuration.broadcaster.content)
      if(typeof config === "object"){
        options = config
      }else{
        twitch.rig.log('invalid config')
      }
    }catch(e){
      twitch.rig.log('invalid config')
    }
  }
});

function updateConfig(json){
  let jsonstring = JSON.stringify(json);
  twitch.rig.log("Is submitted. " + jsonstring + " to " + channelId);
  TwitchConfigurationServiceSet(channelId, clientId, token, "0.0.1", jsonstring);
  sendBroadcast(channelId, clientId, token, jsonstring);
}

function TwitchConfigurationServiceSet (channelId, clientId, token, _version, _content) {
	// Set the HTTP headers required by the Twitch API.
	const headers = {
	  'Client-ID': clientId,
	  'Content-Type': 'application/json',
	  Authorization: 'Bearer ' + token
	}
  
	// Create the POST body for the Twitch API request.
	const body = JSON.stringify({
		segment: "broadcaster",
		channel_id: channelId,
		version: _version,
		content: _content
	})
  
	// Send the broadcast request to the Twitch API.
	$.ajax({
		type: "PUT",
		data: body,
		headers: headers,
		url: `https://api.twitch.tv/extensions/${clientId}/configurations`
	  })
  }

  /**
 * Send broadcast
 * @param {*} channelId ChannelID
 * @param {*} array The Team
 */
function sendBroadcast (channelId, clientId, token, array) {
	// Set the HTTP headers required by the Twitch API.
	const headers = {
	  'Client-ID': clientId,
	  'Content-Type': 'application/json',
	  Authorization: 'Bearer ' + token
	}
  
	// Create the POST body for the Twitch API request.
	const body = JSON.stringify({
	  content_type: 'application/json',
	  message: array,
	  targets: ['broadcast']
	})
  
	// Send the broadcast request to the Twitch API.
	$.ajax({
		type: "POST",
		data: body,
		headers: headers,
		url: `https://api.twitch.tv/extensions/message/${channelId}`
	  })
  }

// Function to save the streamer's WYR options  
$(function(){
  $("#form").submit(function(e){
    e.preventDefault()
    options = []
    $('input[type=checkbox]').each(function () {
      if (this.checked) {
        var option = $(this).val();
        options.push(option)
      }
    })
    updateConfig(options)
  })  
})

