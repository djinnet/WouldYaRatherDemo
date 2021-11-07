var token, userId;
var options = [];
let theme = "";

// so we don't have to write this out everytime 
const twitch = window.Twitch ? window.Twitch.ext : null

// callback called when context of an extension is fired 
twitch.onContext((context) => {
  theme = context.theme
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
  token = auth.token;  //JWT passed to backend for authentication
  userId = auth.userId; //opaque userID 
});

// when the config changes, update the panel! 
twitch.configuration.onChanged(function(){
  if(twitch.configuration.broadcaster){
    try{
      twitch.rig.log('changes the questions');
      UpdatePanel(twitch.configuration.broadcaster.content);
    }catch(e){
      twitch.rig.log('invalid config')
    }
  }
});

function UpdatePanel(data){
  var obj = JSON.parse(data); 
  if(typeof obj === "object"){
    options = obj
    updateOptions()
  }else{
    twitch.rig.log('invalid config')
  }
}


$(function(){
  twitch.listen('broadcast', function (target, contentType, data) {
    twitch.rig.log('listening to questions');
    UpdatePanel(data);
  });

  $("#form").submit(function(event){
    if(!token) { 
      return twitch.rig.log('Not authorized'); 
    }
    event.preventDefault();
    var optionA = $("#selectA").val();
    var optionB = $("#selectB").val();

    twitch.rig.log('Submitting a question: ' + optionA + " " + optionB);
    
    //ajax call
    $.ajax({
      type: 'POST',
      url: location.protocol + '//localhost:3000/question',
      data: JSON.stringify({first:optionA, second: optionB, pick: 1}),
      contentType: 'application/json',
      headers: { "Authorization": 'Bearer ' + token }
    });
  });  
});