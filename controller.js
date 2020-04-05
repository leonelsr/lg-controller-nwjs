var request = require('request');
var parser = require('fast-xml-parser');


var cookieJar = '';

var tvAddr = '192.168.0.8'
var tvPairKey = '587905'
var tvSession = 0;


var cssTitle = 'font-size: 1.2em; font-weight: bold;'
var cssNormal = 'font-size: initial; font-weight: normal;'


// Exibe a key na TV
function showPairingKey(tvAddr) {
    return request({
        url: `http://${tvAddr}:8080/roap/api/auth`,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'Content-Type': 'application/atom+xml'
        },
        body: `<?xml version="1.0" encoding="utf-8"?><auth><type>AuthKeyReq</type></auth>`
    }, function (error, response, body) {
        RESPONSE = response; ERROR = error; BODY = body;
        console.log('%cresponse%c\n',cssTitle, cssNormal, response)
        console.log('%cerror%c\n',cssTitle, cssNormal, error)
        console.log('%cbody%c\n',cssTitle, cssNormal, body)
        //console.log(error, response, body)
    });
}

// Pegar session
function getTVsession(tvAddr, tvPairKey) {
    return request({
        url: `http://${tvAddr}:8080/roap/api/auth`,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'Content-Type': 'application/atom+xml'
        },
        body: `<!--?xml version="1.0" encoding="utf-8"?--><auth><type>AuthReq</type><value>${tvPairKey}</value></auth>`
    }, function (error, response, body) {
        RESPONSE = response; ERROR = error; BODY = body;
        console.log('%cresponse%c\n',cssTitle, cssNormal, response)
        console.log('%cerror%c\n',cssTitle, cssNormal, error)
        console.log('%cbody%c\n',cssTitle, cssNormal, body)
        //console.log(error, response, body)
        // <?xml version="1.0" encoding="utf-8"?><envelope><ROAPError>200</ROAPError><ROAPErrorDetail>OK</ROAPErrorDetail><session>2053616820</session></envelope>

        var data = parser.parse(body)
        tvSession = data.envelope.session;
        console.info(`Got session: ${tvSession}`);
    });
}


function sendCmd(cmdInt, cmdCallback) {
    request({
        url: `http://${tvAddr}:8080/roap/api/command`,
        method: 'POST',
        jar: cookieJar,
        headers: {
            'Content-Type': 'application/atom+xml'
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
            <command>
                <session>${tvSession}</session>
                <type>HandleKeyInput</type>
                <value>${cmdInt}</value>
            </command>`
    }, function (error, response, body) {
        RESPONSE = response; ERROR = error; BODY = body;
        console.log('%cresponse%c\n',cssTitle, cssNormal, response)
        console.log('%cerror%c\n',cssTitle, cssNormal, error)
        console.log('%cbody%c\n',cssTitle, cssNormal, body)
        //console.log(error, response, body)
        if (typeof cmdCallback != 'undefined') {
            cmdCallback(error, response, body);
        }
    });
}


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};




// http://192.168.0.8:8080/udap/api/data?target=cur_channel

/* 
<?xml version="1.0" encoding="utf-8"?><envelope><ROAPError>200</ROAPError><ROAPErrorDetail>OK</ROAPErrorDetail><data><chtype>terrestrial</chtype><sourceIndex>1</sourceIndex><physicalNum>34</physicalNum><major>12</major><displayMajor>12</displayMajor><minor>1</minor><displayMinor>1</displayMinor><chname>RBS TV HD</chname><progName>Bom Sucesso</progName><audioCh>0</audioCh><inputSourceName>TV</inputSourceName><inputSourceType>0</inputSourceType><labelName></labelName><inputSourceIdx>0</inputSourceIdx></data></envelope>
*/


// http://192.168.0.8:8080/udap/api/data?target=context_ui


// http://192.168.0.8:8080/udap/api/data?target=volume_info


// http://192.168.0.8:8080/udap/api/data?target=applist_get&type=integer_value_type&index=integer_value_index&number=integer_value_number
// http://192.168.0.8:8080/udap/api/data?target=applist_get&type=1&index=0&number=1024


/*

1       POWER
2       Number 0
3       Number 1
4       Number 2
5       Number 3
6       Number 4
7       Number 5
8       Number 6
9       Number 7
10      Number 8
11      Number 9
12      UP key among remote Controller’s 4 direction keys
13      DOWN key among remote Controller’s 4 direction keys
14      LEFT key among remote Controller’s 4 direction keys
15      RIGHT key among remote Controller’s 4 direction keys
20      OK
21      Home menu
22      Menu key (same with Home menu key)
23      Previous key (Back)
24      Volume up
25      Volume down
26      Mute (toggle)
27      Channel UP (+)
28      Channel DOWN (-)
29      Blue key of data broadcast
30      Green key of data broadcast
31      Red key of data broadcast
32      Yellow key of data broadcast
33      Play
34      Pause
35      Stop
36      Fast forward (FF)
37      Rewind (REW)
38      Skip Forward
39      Skip Backward
40      Record
41      Recording list
42      Repeat
43      Live TV
44      EPG
45      Current program information
46      Aspect ratio
47      External input
48      PIP secondary video
49      Show / Change subtitle
50      Program list
51      Tele Text
52      Mark
400     3D Video
401     3D L/R
402     Dash (-)
403     Previous channel (Flash back)
404     Favorite channel
405     Quick menu
406     Text Option
407     Audio Description
408     NetCast key (same with Home menu)
409     Energy saving
410     A/V mode
411     SIMPLINK
412     Exit
413     Reservation programs list
414     PIP channel UP
415     PIP channel DOWN
416     Switching between primary/secondary video
417     My Apps

*/
