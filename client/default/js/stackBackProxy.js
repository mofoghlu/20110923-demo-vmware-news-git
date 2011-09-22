/**
 * This is just a codedrop of AjaxProxy, with most of the logic stripped out. We want to get to a point
 * where we call the readers callback function without tripping up Sencha's error handling. 
 */



Ext.data.StackBack = Ext.extend(Ext.data.ServerProxy, {
    
    constructor: function() {       
        Ext.data.AjaxProxy.superclass.constructor.apply(this, arguments);    
    },
  
    doRequest: function(operation, callback, scope) {
        var callback = this.createRequestCallback(null, operation, callback, scope);
        callback();
        return;
    },
    
    createRequestCallback: function(request, operation, callback, scope) {
        var me = this;
        
        return function(options, success, response) {

	        var reader  = me.getReader();
	
	
	        
	        var result  = reader.read({}),
	            records = result.records,
	            length  = records.length,
	            mc      = new Ext.util.MixedCollection(true, function(r) {return r.getId();}),
	            record, i;
	        
	        mc.addAll(operation.records);
	        for (i = 0; i < length; i++) {
	            record = mc.get(records[i].getId());
	            
	            if (record) {
	                record.set(record.data);
	            }
	        }
	
	        //see comment in buildRequest for why we include the response object here
	        Ext.apply(operation, {
	            response : response,
	            resultSet: result
	        });
	        
	        operation.setCompleted();
	        operation.setSuccessful();

            
            //this callback is the one that was passed to the 'read' or 'write' function above
            if (typeof callback == 'function') {
                callback.call(scope || me, operation);
            }
        };
    }
});

Ext.data.ProxyMgr.registerType('stackback', Ext.data.StackBack);