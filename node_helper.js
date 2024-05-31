/* Magic Mirror
 * Module: ProfileControl
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')
module.exports = NodeHelper.create({

  start: function () {
    this.started = false
    this.curHorizontalProfileIndex = 0
    this.curVerticalProfileIndex = 0
    this.horizontalIndexPerVerticalIndex = {}

     /**
    * Modulo that also works with negative numbers.
    * @param {number} x The dividend
    * @param {number} n The divisor
    */
    this.mod = (x, n) => ((x % n) + n) % n;
  },

  calculateAndSendNewHorizontalProfile: function(newIndex){
    const self = this
    var curRealNewHorizontalIndex = newIndex
    if(self.config.startAgainAtHorizontalEnd){
      curRealNewHorizontalIndex = self.mod(newIndex,self.config.profiles.length)
    } else {
      if(newIndex > (self.config.profiles.length-1)){
        curRealNewHorizontalIndex = self.config.profiles.length-1
      } else if (newIndex < 0){
        curRealNewHorizontalIndex = 0
      }
    }

    let restoreIndex = self.config.restoreVerticalIndexOnHorziontalChange
    if ( (restoreIndex === true) || ((typeof restoreIndex[curRealNewHorizontalIndex] !== "undefined") && (restoreIndex[curRealNewHorizontalIndex] === true))
    ){
      self.curVerticalProfileIndex = self.verticalIndexPerHorizontalIndex[curRealNewHorizontalIndex] || 0
      self.verticalIndexPerHorizontalIndex[curRealNewHorizontalIndex] = self.curVerticalProfileIndex
    } else {
      if(self.config.zeroVerticalIndexOnHorziontalChange){
        self.curVerticalProfileIndex = 0
      } else {
        if(self.curVerticalProfileIndex >= self.config.profiles[curRealNewHorizontalIndex].length){
          if(self.config.verticalOverflowJumpToZero){
            self.curVerticalProfileIndex = 0 
          } else {
            self.curVerticalProfileIndex = self.config.profiles[curRealNewHorizontalIndex].length - 1  
          }
        }
      }
    }
    
    var newProfileName = self.config.profiles[curRealNewHorizontalIndex][self.curVerticalProfileIndex]
    self.curHorizontalProfileIndex = curRealNewHorizontalIndex
    self.sendSocketNotification("CURRENT_PROFILE",newProfileName)
  },

  calculateAndSendNewVerticalProfile: function(newIndex){
    const self = this
    var curRealNewVerticalIndex = newIndex
    if(self.config.startAgainAtVerticalEnd){
      curRealNewVerticalIndex = self.mod(newIndex,self.config.profiles[self.curHorizontalProfileIndex].length)
    } else {
      if(newIndex > (self.config.profiles[self.curHorizontalProfileIndex].length-1)){
        curRealNewVerticalIndex = self.config.profiles[self.curHorizontalProfileIndex].length-1
      } else if (newIndex < 0){
        curRealNewVerticalIndex = 0
      }
    }

    if(self.config.zeroHorizontalIndexOnVertialChange){
      self.curHorizontalProfileIndex = 0
    } else {
      if(self.curHorizontalProfileIndex >= self.config.profiles.length){
        if(self.config.horizontalOverflowJumpToZero){
          self.curHorizontalProfileIndex = 0
        } else {
          self.curHorizontalProfileIndex = self.config.profiles.length - 1 
        }
      }
    }

    var newProfileName = self.config.profiles[self.curHorizontalProfileIndex][curRealNewVerticalIndex]
    self.curVerticalProfileIndex = curRealNewVerticalIndex
    self.sendSocketNotification("CURRENT_PROFILE",newProfileName)
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this
    console.log(self.name + ': Received notification '+notification)
    if (notification === 'CONFIG' && self.started === false) {
      self.config = payload
      self.started = true
    } else if (notification === 'PROFILE_SET_HORIZONTAL'){
      self.calculateAndSendNewHorizontalProfile(payload)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if (notification === 'PROFILE_SET_VERTICAL'){
      self.calculateAndSendNewVerticalProfile(payload)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if (notification === 'PROFILE_INCREMENT_VERTICAL'){
      self.calculateAndSendNewVerticalProfile(self.curVerticalProfileIndex + 1)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if (notification === 'PROFILE_DECREMENT_VERTICAL'){
      self.calculateAndSendNewVerticalProfile(self.curVerticalProfileIndex - 1)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if (notification === 'PROFILE_INCREMENT_HORIZONTAL'){
      self.calculateAndSendNewHorizontalProfile(self.curHorizontalProfileIndex + 1)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if (notification === 'PROFILE_DECREMENT_HORIZONTAL'){
      self.calculateAndSendNewHorizontalProfile(self.curHorizontalProfileIndex + -1)
      if (self.config.sendPresenceNotificationOnAction){
        self.sendSocketNotification( "NOTIFICATION_AFTER_CHANGE",{notification: "USER_PRESENCE", payload: true})
      }
    } else if(notification === "CHANGED_PROFILE"){
      for(var curProfileName in self.config.notifications){
        if(payload.to === curProfileName){
          let curNotifications = self.config.notifications[curProfileName]
          for(var i = 0; i < curNotifications.length; i++){
            this.sendSocketNotification("NOTIFICATION_AFTER_CHANGE", curNotifications[i])
          }
          break
        }
      }

      self.curHorizontalProfileIndex = -1;
      self.curVerticalProfileIndex = -1;

      for(var i = 0; i < self.config.profiles.length; i++){
        for (var j = 0; j < self.config.profiles[i].length; j++){
          if(payload.to === self.config.profiles[i][j])
          {
            self.curHorizontalProfileIndex = i;
            self.curVerticalProfileIndex = j;
            if (typeof self.verticalIndexPerHorizontalIndex === "undefined"){
              self.verticalIndexPerHorizontalIndex = {}
            }
            self.verticalIndexPerHorizontalIndex[self.curHorizontalProfileIndex] = self.curVerticalProfileIndex
            break;
          }
        }
        if(self.curHorizontalProfileIndex != -1){
          break;
        }
      }
      self.sendSocketNotification("CURRENT_PROFILE_INDEX",{horizontal: self.curHorizontalProfileIndex, vertical: self.curVerticalProfileIndex})
    }
  }
})
