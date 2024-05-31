Module.register('MMM-ProfileControl', {

  /**
   * By default, we should try to make the configuration match the demo
   * implementation. This means 3 pages, and some default enabled styles.
   */
  defaults: {
    profiles: [[]],
    notifications: {},
    showHorizontalIndicator: true,
    showSeparator: true,
    showVerticalIndicator: true,
    startAgainAtHorizontalEnd: true,
    startAgainAtVerticalEnd: true,
    horizontalOverflowJumpToZero: false,
    verticalOverflowJumpToZero: false,
    zeroVerticalIndexOnHorziontalChange: false,
    restoreVerticalIndexOnHorziontalChange: false,
    zeroHorizontalIndexOnVertialChange: false,
    iconPrefix: 'indicator fa ',
    horizontalActiveIcon: 'fa-circle',
    horizontalInactiveIcon: 'fa-circle-thin',
    verticalActiveIcon: 'fa-circle',
    verticalInactiveIcon: 'fa-circle-thin',
    seperatorIcon: 'fa-bullseye',
    noChangeDuringScreensave: true,
    
  },

  /**
   * Apply any styles, if we have any.
   */
  getStyles() {
    return ['font-awesome.css', 'profile-control.css'];
  },

  /**
   * Pseudo-constructor for our module. Sets the default current page to 0.
   */
  start() {
    this.curHorizontalProfileIndex = 0;
    this.curVerticalProfileIndex = 0;
    Log.info("Starting module: " + this.name);
    this.sendSocketNotification('CONFIG', this.config);
    this.inScreensaveMode = false;
  },

  /**
   * Render the cicles for each page, and highlighting the page we're on.
   */
  getDom() {
    const self = this
    let wrapper = document.createElement('div');
    if(self.config.showHorizontalIndicator){
      let horizontalWrapper = document.createElement('span')
        horizontalWrapper.className='horizontalWrapper'
      for (let i = 0; i < self.config.profiles.length; i += 1) {
        let circle = document.createElement('i');
        
        let circleClass = self.config.iconPrefix
        if (self.curHorizontalProfileIndex === i) {
          if ((Array.isArray(self.config.horizontalActiveIcon)) &&
              (typeof self.config.horizontalActiveIcon[i] !== "undefined")){
                circleClass += self.config.horizontalActiveIcon[i]    
          } else {
            circleClass += self.config.horizontalActiveIcon
          }
        } else {
          if ((Array.isArray(self.config.horizontalInactiveIcon)) &&
              (typeof self.config.horizontalInactiveIcon[i] !== "undefined")){
                circleClass += self.config.horizontalInactiveIcon[i]    
          } else {
            circleClass += self.config.horizontalInactiveIcon
          }
        }
        circle.className =  circleClass
        horizontalWrapper.appendChild(circle);
  
        // Lets people change the page by clicking on the respective circle.
        // So apparently this doesn't work if we don't call the last two methods,
        // despite those methods being called in when calling sendNotification.
        // This is likely a bug (because spamming a single button) causes rapid-
        // fire page changing, but for most cases that shouldn't be a problem.
        circle.onclick = () => {
          self.sendSocketNotification('PROFILE_SET_HORIZONTAL', i);
          self.updateDom();
        };
      }

      wrapper.appendChild(horizontalWrapper)
    }

    if(self.config.showVerticalIndicator){
      let verticalWrapper = document.createElement('span')
        verticalWrapper.className = 'verticalWrapper'
      
      if(
          self.config.showSeparator && 
          self.config.showHorizontalIndicator && 
          (self.config.profiles[self.curHorizontalProfileIndex].length > 0)
        ){
          let seperatorWrapper = document.createElement('span')
          seperatorWrapper.className = 'separatorWrapper'
          let seperator = document.createElement('i')
          seperator.className = self.config.iconPrefix + self.config.seperatorIcon;
          seperatorWrapper.appendChild(seperator)
          wrapper.appendChild(seperatorWrapper)
      }

      for (let i = 0; i < self.config.profiles[self.curHorizontalProfileIndex].length; i += 1) {
        let circle = document.createElement('i');
  
        let circleClass = self.config.iconPrefix
        if (self.curVerticalProfileIndex === i) {
          circleClass += self.config.verticalActiveIcon;
        } else {
          circleClass += self.config.verticalInactiveIcon;
        }
        circle.className =  circleClass
        verticalWrapper.appendChild(circle);
  
        // Lets people change the page by clicking on the respective circle.
        // So apparently this doesn't work if we don't call the last two methods,
        // despite those methods being called in when calling sendNotification.
        // This is likely a bug (because spamming a single button) causes rapid-
        // fire page changing, but for most cases that shouldn't be a problem.
        circle.onclick = () => {
          self.sendSocketNotification('PROFILE_SET_VERTICAL', i);
          self.updateDom();
        };
      }

      wrapper.appendChild(verticalWrapper)
    }

    return wrapper;
  },

  notificationReceived: function(notification,payload) {
    if(notification === "CHANGED_PROFILE"){
      this.sendSocketNotification(notification,payload)
    } else if (notification.startsWith("PROFILE_")){
      if(!this.inScreensaveMode || !this.config.noChangeDuringScreensave){
        this.sendSocketNotification(notification,payload)
      }
    } else if(notification === 'SCREENSAVE_ENABLED'){
      this.inScreensaveMode = true
    } else if(notification === 'SCREENSAVE_DISABLED'){
      this.inScreensaveMode = false
    }
  },

  socketNotificationReceived: function (notification, payload) {
    if(notification === "CURRENT_PROFILE"){
      this.sendNotification(notification, payload)
    } else if (notification === 'CURRENT_PROFILE_INDEX'){
      this.curHorizontalProfileIndex = payload.horizontal
      this.curVerticalProfileIndex = payload.vertical
      this.updateDom()
    } else if (notification === 'NOTIFICATION_AFTER_CHANGE'){
      if(typeof payload.payload === 'undefined'){
        this.sendNotification(payload.notification, null)
      } else {
        this.sendNotification(payload.notification, payload.payload)
      }
    }
  },

});
