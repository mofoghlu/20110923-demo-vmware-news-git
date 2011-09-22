/*
 * NodeJS Module for a logger.
 *
 * @author Roshan
 */
var Logger = function() {

    // Public Functions
    this.log = log;
    this.debug = debug;
    this.info = info;
    this.warn = warn;
    this.error = error;
    
    // Log levels
    this.DEBUG = 1;
    this.INFO = 2;
    this.WARN = 3;
    this.ERROR = 4;
    this.OFF = 5;

    var logLevelsMap = {
            1: "DEBUG: ",
            2: "INFO: ",
            3: "WARN: ",
            4: "ERROR: "
    }

    // Current log level
    var logLevel = this.INFO;

    function log(level, message) {
                
        // Level not specified or not a standard level we support.
        if(level == null || !logLevelsMap.hasOwnProperty(level)) {
            return;
        }
        
        var levelString = logLevelsMap[level];
        
        if(level >= logLevel) {
            console.log(levelString + message);
        }
        
    }

    //
    // Convenience methods for the logger.
    //
    function debug(message) {
        this.log(this.DEBUG, message);
    }

    function info(message) {
        this.log(this.INFO, message);
    }

    function warn(message) {
        this.log(this.WARN, message);
    }

    function error(message) {
        this.log(this.ERROR, message);
    }
    
    
}; // End Logger

// Export Module
module.exports = new Logger();
