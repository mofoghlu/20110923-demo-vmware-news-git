// Web Service configuration parameters
function ServiceConfig() {

    // Service HTTP Timeout
    this.timeout = 60000;

    // Local Test Environment (via VPN)
    // this.host = "qaiosb.vmware.com";
    // this.port = 8011;
    // this.secure = false;

    // CloudFoundry Environment (vmware.feedhenry.com).
    this.host = "ext-osb-wdcqai.vmware.com";
    this.port = 443;
    this.secure = true;

};

module.exports = new ServiceConfig();
