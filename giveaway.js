
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
    var spinnerOpts = { scale: 1.5, top: '25%', left: '50%', position: 'absolute' }
    var target = document.getElementById('body')
    var spinner = new Spinner(spinnerOpts).spin(target);
    
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

