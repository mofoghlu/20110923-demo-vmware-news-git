/*
 * Package specific javascript overrides - for simple user interface tweaks that won't need a whole new file. 
 */

App.profile.profile_left.dock = '';
App.profile.profile_left.width = '100%';


App.profile.container =  new Ext.Panel({
  title: 'My Profile',
  iconCls: 'profileIcon',
  scroll: 'vertical',
  items: [App.profile.profile_left, App.profile.profile_right]
});