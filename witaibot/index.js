const {
    Wit,
    log
} = require('node-wit');

module.exports = function(witToken) {
    return new Witbot(witToken)
}

function Witbot(witToken) {
    var self = this
    self._witToken = witToken
    wit = new Wit({
        accessToken: witToken
    });

    // process text with Wit.ai.
    // 1st argument is the text of the message
    // Remaining arguments will be passed as the first arguments of each registered callback
    self.process = function(text) {
        var args = Array.prototype.slice.call(arguments)
        var intents = new Intents()
        var matched = false
        args.shift()
        wit.message(text, {})
            .then((res) => {
                // only consider the 1st outcome
                if (res.entities.intent && res.entities.intent.length > 0) {
                    var outcome = res.entities.intent[0]
                    var intent = outcome.value
                    args.push(outcome)
                    console.log(intent);
                    console.log("Intents: " +
                        intents._intents[intent]);
                    if (intents._intents[intent]) {
                        intents._intents[intent].forEach(function(registration) {
                            if (!matched && outcome.confidence >= registration.confidence) {
                                matched = true
                                registration.fn.apply(undefined, args)
                            }
                        })
                    } else if (intents._any) {
                        matched = true
                        intents._any.apply(undefined, args)
                    }
                }

                // there were no matched outcomes or matched routes
                if (!matched) intents._catchall.apply(undefined, args)
            })
            .catch(console.error);

        return intents
    }
}

function Intents() {
    var self = this
    self._intents = {}
    self._catchall = function() {}

    self.hears = function(name, confidence, fn) {
        var registration = {
            confidence: confidence,
            fn: fn
        }
        if (!self._intents[name]) {
            self._intents[name] = [registration]
        } else {
            self._intents[name].push(registration)
        }
        return self
    }

    self.otherwise = function(fn) {
        self._catchall = fn
        return self
    }

    self.any = function(fn) {
        self._any = fn
        return self
    }
}
