var exampleDetails = {
    "item": "Hardcoded Test Item",
    "questCount": 4,
    "entryEmail": "entry@email.com",
    "expiration": "2015-11-21 24:00:00",
    "questKeyLocations": "The quest keys may show up in \"cards\" within the first couple of minutes of any of my videos from this year.  They may also appear in photos posted to my Flickr photostream this year (in the photo itself, or in tags or descriptions).  If you don't know my Flickr photostream, you'll have to figure that out, too."
};

var queryString = function(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
    var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

var renderError = function(message) {
    var source = $("#error").html();
    var template = Handlebars.compile(source);
    var html = template({
        message: message
    });
    $('body').html(html);
};

var renderIntro = function(giveawayDetails) {
    var source = $("#intro").html();
    var template = Handlebars.compile(source);
    giveawayDetails.expirationFormatted = moment(giveawayDetails.expiration).format("MMMM Do YYYY, hh:mm");
    giveawayDetails.expirationFromNow = moment(giveawayDetails.expiration).fromNow();
    var html = template(giveawayDetails);
    $('#intro-placeholder').html(html);
};

var renderForm = function(giveawayDetails) {
    var source = $("#giveaway-form").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#giveaway-form-placeholder').html(html);
};

var renderInstructions = function(giveawayDetails) {
    var source = $("#instructions").html();
    var template = Handlebars.compile(source);
    var html = template(giveawayDetails);
    $('#instructions-placeholder').html(html);
};

var renderExampleEmail = function(giveawayDetails) {
    var source = $("#example-email").html();
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

var questSpinner = function() {
    return new Spinner({
        length: 0,
        corners: 1,
        width: 4,
        trail: 40,
        scale: 1.0,
        top: '.65em',
        left: '50%',
        position: 'relative'
    });
}

var giveawaySpinner = function() {
    return new Spinner({
        length: 0,
        corners: 1,
        width: 4,
        scale: 1.5,
        trail: 40,
        top: '25%',
        left: '50%',
        position: 'absolute'
    });
}

var renderQuest = function(apigClient) {
    var errorMsg = "No quest matching that quest key!";
    var questDisplay = $('#result');

    questDisplay.html("&nbsp;");
    var spinner = questSpinner().spin(questDisplay[0]);

    var questKey = $('#questKey').val();
    var params = {
        giveawaycode: queryString("g"),
        questKey: questKey
    };

    apigClient.giveawayQuestGiveawaycodeQuestKeyGet(params, {}, {})
        .then(function(result) {
            var quest = result.data;
            questDisplay.html(quest ? quest : errorMsg);
        }).catch(function(result) {
            questDisplay.html(errorMsg);
        });
};

$(window).load(function() {
    var spinner = giveawaySpinner().spin($('body')[0]);

    var apigClient = apigClientFactory.newClient();

    var params = {
        giveawaycode: queryString("g")
    };
    apigClient.giveawayDetailsGiveawaycodeGet(params, {}, {})
        .then(function(result) {
            if (typeof result.data === "string") {
                spinner.stop();
                renderError(result.data);
                $('#errorMessage').fadeIn();
            } else {
//                renderAll(result.data);
                renderAll(exampleDetails);
                spinner.stop();
                $('#main').fadeIn(function() {
                    $('#questKey').focus();
                });

                $('#submit').click(function() {
                    renderQuest(apigClient)
                });
                $('#questKey').on("keypress", function(e) {
                    if (e.which === 13) {
                        renderQuest(apigClient);
                        e.preventDefault();
                    }
                });
            }
        }).catch(function(result) {
            console.log(result);
        });
});