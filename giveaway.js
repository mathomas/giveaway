
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

var displayIntro = function(giveawayDetails) {
    var source   = $("#intro").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#intro-placeholder').html(html);
};

var displayInstructions = function(giveawayDetails) {
    var source   = $("#instructions").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#instructions-placeholder').html(html);
};

var displayExampleEmail = function(giveawayDetails) {
    var source   = $("#example-email").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#example-email-placeholder').html(html);
};

var displayForm = function(giveawayDetails) {
    var source   = $("#giveaway-form").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#giveaway-form-placeholder').html(html);
};

var displayQuest = function (apigClient) {
    var questDisplay = $('#result');
    questDisplay.fadeTo("slow", 0, function() {
        console.log("in fadeTo");
        var questKey = $('#questKey').val();
        var params = { giveawaycode: queryString("g"), questKey: questKey };

        apigClient.giveawayQuestGiveawaycodeQuestKeyGet(params, {}, {})
            .then(function(result){
                var quest = result.data;
                questDisplay.html(quest);
                questDisplay.fadeTo(5000, 100);
            }).catch( function(result){
                questDisplay.html("No quest matching that quest key!");
                questDisplay.fadeIn("slow");
        });
    });
}

$(window).load(function(){
    var apigClient = apigClientFactory.newClient();

    var params = { giveawaycode: queryString("g") };
    apigClient.giveawayDetailsGiveawaycodeGet(params, {}, {})
        .then(function(result){
            var giveawayDetails = result.data;
            displayIntro(giveawayDetails);
            displayForm(giveawayDetails);
            displayInstructions(giveawayDetails);
            displayExampleEmail(giveawayDetails);

            $('#submit').click(function() {displayQuest(apigClient)});
        }).catch( function(result){
            console.log(result);
    });
});

