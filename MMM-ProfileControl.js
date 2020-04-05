Module.register('MMM-ProfileControl', {

  /**
   * By default, we should try to make the configuration match the demo
   * implementation. This means 3 pages, and some default enabled styles.
   */
  defaults: {
    profiles: [[]],
    notifications: {},
    showHorizontalIndicator: true,
    showVerticalIndicator: true,
    startAgainAtHorizontalEnd: true,
    startAgainAtVerticalEnd: true,
    horizontalOverflowJumpToZero: false,
    verticalOverflowJumpToZero: false,
    zeroVerticalIndexOnHorziontalChange: false,
    zeroHorizontalIndexOnVertialChange: false,
    iconPrefix: 'indicator fa ',
    horizontalActiveIcon: 'fa-circle',
    horizontalInactiveIcon: 'fa-circle-thin',
    verticalActiveIcon: 'fa-circle',
    verticalInactiveIcon: 'fa-circle-thin',
    seperatorIcon: 'fa-bullseye'
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
    this.sendSocketNotification('CONFIG', this.config)
  },

  /**
   * Render the cicles for each page, and highlighting the page we're on.
   */
  getDom() {
    const wrapper = document.createElement('div');
    if(this.config.showHorizontalIndicator){
      const horizontalWrapper = document.createElement('span')
        horizontalWrapper.className='horizontalWrapper'
      for (let i = 0; i < this.config.profiles.length; i += 1) {
        const circle = document.createElement('i');
  
        if (this.curHorizontalProfileIndex === i) {
          circle.className = this.config.iconPrefix + this.config.horizontalActiveIcon;
        } else {
          circle.className = this.config.iconPrefix + this.config.horizontalInactiveIcon;
        }
        horizontalWrapper.appendChild(circle);
  
        const self = this;
  
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

    if(this.config.showVerticalIndicator){
      const verticalWrapper = document.createElement('span')
        verticalWrapper.className = 'verticalWrapper'
      if(this.config.showHorizontalIndicator && this.config.profiles[this.curHorizontalProfileIndex].length > 0){
        const seperatorWrapper = document.createElement('span')
          seperatorWrapper.className = 'separatorWrapper'
        const seperator = document.createElement('i')
        seperator.className = this.config.iconPrefix + this.config.seperatorIcon;
        seperatorWrapper.appendChild(seperator)
        wrapper.appendChild(seperatorWrapper)
      }

      for (let i = 0; i < this.config.profiles[this.curHorizontalProfileIndex].length; i += 1) {
        const circle = document.createElement('i');
  
        if (this.curVerticalProfileIndex === i) {
          circle.className = this.config.iconPrefix + this.config.verticalActiveIcon;
        } else {
          circle.className = this.config.iconPrefix + this.config.verticalInactiveIcon;
        }
        verticalWrapper.appendChild(circle);
  
        const self = this;
  
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
    if(
      (notification === "CHANGED_PROFILE") ||
      (notification.startsWith("PROFILE_"))
    ){
      this.sendSocketNotification(notification,payload)
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
