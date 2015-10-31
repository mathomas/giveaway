
var exampleDetails = {
    "item": "Hardcoded Test Item",
    "questCount": 4,
    "entryEmail": "entry@email.com"
};

var queryString = function(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

var renderIntro = function(giveawayDetails) {
    var source   = $("#intro").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#intro-placeholder').html(html);
};

var renderForm = function(giveawayDetails) {
    var source   = $("#giveaway-form").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#giveaway-form-placeholder').html(html);
};

var renderInstructions = function(giveawayDetails) {
    var source   = $("#instructions").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#instructions-placeholder').html(html);
};

var renderExampleEmail = function(giveawayDetails) {
    var source   = $("#example-email").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#example-email-placeholder').html(html);
};

var renderAll = function(giveawayDetails) {
    renderIntro(giveawayDetails);
    renderForm(giveawayDetails);
    renderInstructions(giveawayDetails);
    renderExampleEmail(giveawayDetails);
};

var renderQuest = function (apigClient) {
    var errorMsg = "No quest matching that quest key!";
    var questDisplay = $('#result');
    
    questDisplay.fadeTo("slow", 0, function() {
        var questKey = $('#questKey').val();
        var params = { giveawaycode: queryString("g"), questKey: questKey };

        apigClient.giveawayQuestGiveawaycodeQuestKeyGet(params, {}, {})
            .then(function(result){
                console.log(result);
                var quest = result.data;
                questDisplay.html(quest ? quest : errorMsg);
                questDisplay.fadeTo(5000, 100);
            }).catch( function(result){
                console.log(result);
                questDisplay.html(errorMsg);
                questDisplay.fadeTo(5000, 100);
        });
    });
};

$(window).load(function(){
    var opts = {
      lines: 13 // The number of lines to draw
    , length: 28 // The length of each line
    , width: 14 // The line thickness
    , radius: 42 // The radius of the inner circle
    , scale: .75 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.25 // Opacity of the lines
    , rotate: 0 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 0.9 // Rounds per second
    , trail: 48 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '25%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    }
    var target = document.getElementById('body')
    var spinner = new Spinner(opts).spin(target);
    
    var apigClient = apigClientFactory.newClient();

    var params = { giveawaycode: queryString("g") };
    apigClient.giveawayDetailsGiveawaycodeGet(params, {}, {})
        .then(function(result){
            renderAll(result.data);
            spinner.stop();
            $('#main').fadeIn(function() {
                $('#questKey').focus();
            });

            $('#submit').click(function() {renderQuest(apigClient)});
            $('#questKey').on("keypress", function(e) {
                if(e.which === 13){
                    renderQuest(apigClient);
                    e.preventDefault();
                }
            });
        }).catch( function(result){
            console.log(result);
    });
});

